from bobverse.domain.services.article import IArticleService
import argparse
import asyncio
import datetime
import os
import pathlib
import re
import sys

from sqlalchemy.ext.asyncio import create_async_engine

from bobverse.core.config import get_app_settings
from bobverse.infrastructure.models import Base

from bobverse.core.container import container
from bobverse.domain.dtos.article import CreateArticleDTO, UpdateArticleDTO
from bobverse.domain.dtos.user import CreateUserDTO




async def init_db():
    """Initialize the SQLite database with the schema."""
    settings = get_app_settings()
    
    # Create the database directory if it doesn't exist
    db_path = settings.sqlite_db_path.replace("sqlite+aiosqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    # Create the database engine
    engine = create_async_engine(settings.sql_db_uri)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    
    print(f"SQLite database initialized at {db_path}")


def find_md_files(directory="articles") -> list[str]:
    """
    Recursively traverse the specified directory and return all .md files.
    
    Args:
        directory (str): The directory to search in, relative to current directory
        
    Returns:
        list: A list of all .md file paths, relative to current directory
    """
    txt_files = []
    base_path = pathlib.Path(directory)
    
    # Check if directory exists
    if not base_path.exists() or not base_path.is_dir():
        print(f"Warning: Directory '{directory}' does not exist or is not a directory")
        return txt_files
    
    # Walk through all files and subdirectories
    for path in base_path.rglob("*.md"):
        # Ignore README.md files (case-insensitive)
        if path.name.lower() != "readme.md":
            # Convert to relative path string
            relative_path = str(path)
            txt_files.append(relative_path)
    
    txt_files.sort()

    return txt_files


def create_article_dto_from_file(filename: str, initial_date: datetime.datetime | None = None) -> CreateArticleDTO:
    """
    Create a CreateArticleDTO from a markdown file.
    
    The file should have a header section between '---' markers containing:
    - title: article title
    - description: article description
    - keywords: comma separated list of words (used as tags)
    
    If title is missing in the header, the first markdown H1 title in the body is used.
    
    If the directory for filename startswith 'articles/top/', set the created_at property
    to the current time. Otherwise, set it to the current time minus 1 day.
    
    Args:
        filename (str): Path to the markdown file
        
    Returns:
        CreateArticleDTO: Data transfer object for article creation
    """
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Extract header and body
        parts = content.split('---', 2)
        
        # If the file doesn't have the expected format with '---' markers
        if len(parts) < 3:
            # No header found, treat the whole content as body
            header_text = ""
            body = content.strip()
        else:
            header_text = parts[1].strip()
            body = parts[2].strip()
        
        # Parse header
        header = {}
        for line in header_text.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            # Split by first colon
            if ':' in line:
                key, value = line.split(':', 1)
                header[key.strip().lower()] = value.strip()
        
        # Get title from header or first H1 in body
        title = header.get('title', '')
        if not title:
            # Look for the first markdown H1 title
            for line in body.split('\n'):
                if line.strip().startswith('# '):
                    title = line.strip()[2:].strip()
                    break
        
        # Get description and tags
        description = header.get('description', '')
        keywords = header.get('keywords', '')
        tags = [tag.strip() for tag in keywords.split(',')] if keywords else []
        
        # Set created_at based on file path and initial_date if provided
        if initial_date is None:
            now = datetime.datetime.now()
        else:
            now = initial_date
        
        # If the file is in articles/top/, set created_at to now
        # Otherwise, set it to now minus 1 day
        if filename.startswith("articles/top/"):
            created_at = now
        else:
            created_at = now - datetime.timedelta(days=2)
            
        # Create and return DTO
        return CreateArticleDTO(
            title=title,
            description=description,
            body=body,
            tags=tags,
            created_at=created_at,
            updated_at=created_at
        )
    except Exception as e:
        print(f"Error processing file {filename}: {e}")
        # Re-raise the exception
        raise

def replace_with_slugs(body: str, slug_by_name: dict[str, str]) -> str:
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, slug_by_name.keys())) + r")\b")

    def replacer(match: re.Match) -> str:
        filename: str = match.group(0)
        return (f"article/{slug_by_name.get(filename)}") if filename in slug_by_name else filename

    return pattern.sub(replacer, body)


def parse_date_argument(date_str: str) -> datetime.datetime:
    """
    Parse a date string in the format 'yyyy-mm-dd' and return a datetime object.
    
    Args:
        date_str (str): Date string in the format 'yyyy-mm-dd'
        
    Returns:
        datetime.datetime: Parsed datetime object
        
    Raises:
        ValueError: If the date string is not in the correct format
    """
    try:
        return datetime.datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        print(f"Error: Date '{date_str}' is not in the required format 'yyyy-mm-dd'")
        sys.exit(1)


async def seed_initial_data(initial_date: datetime.datetime | None = None):
    """Seed the database with initial articles."""
    print("Seeding initial data...")

    # Get services from container
    user_service = container.user_service()
    article_service: IArticleService = container.article_service()

    # Create test users
    test_user = CreateUserDTO(
        username="AskBob",
        email="AskBob@example.com",
        password="password123"
    )

    default_user = CreateUserDTO(
        username="demo",
        email="demo@example.com",
        password="demo1234"
    )

    # get list of sample articles
    article_files: list[str] = find_md_files()

    # Use a context session to add data
    async with container.context_session() as session:
        # Create the users
        user = await user_service.create_user(session, test_user)
        print(f"Created user: {user.username} (ID: {user.id})")

        demo_user = await user_service.create_user(session, default_user)
        print(f"Created user: {demo_user.username} (ID: {demo_user.id})")
        
        # Create articles
        print("Creating articles:")

        # slug_by_name maps article path without the "articles" prefix and without the .md to slug
        # example, for file articles/basic-usage/using-modes.md:
        #     {'basic-usage/using-modes': 'using-modes-zda9ucr8'}
        slug_by_name = dict()
        for article_file in article_files:
            article_short_file = article_file.replace("articles/", "", 1).replace(".md", "")
            article_data = create_article_dto_from_file(article_file, initial_date)
            article = await article_service.create_new_article(
                session=session,
                author_id=user.id,
                article_to_create=article_data
            )
            print(f"{article_short_file}: {article.title} (Slug: {article.slug})")
            slug_by_name[article_short_file] = article.slug

        # articles must be linked by slug instead of filename.
        # the code below replace reference to files with the slug.
        # for instance: 
        #    explore different [modes](/basic-usage/using-modes) for specialized workflows
        # is replaced by:
        #    explore different [modes](/basic-usage/using-modes-slug) for specialized workflows
        # where using-modes-slug is the slug create when the using-modes article was created
        for article_short_file, article_slug in slug_by_name.items():
            print(f"Fixing slugs in {article_slug}")
            article = await article_service.get_article_by_slug(
                session=session,
                slug=article_slug,
                current_user=user)
            replaced_body = replace_with_slugs(article.body, slug_by_name)
            if article.body != replaced_body:
                update_article = UpdateArticleDTO(
                    article.title,
                    article.description,
                    replaced_body,
                    updated_at = article.updated_at # do not change update date
                )
                article = await article_service.update_article_by_slug(
                    session=session,
                    slug=article_slug,
                    article_to_update=update_article,
                    current_user=user
                )
        print(f"Added {len(article_files)} articles")


async def main():
    """Initialize the database and seed it with initial data."""
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Initialize SQLite database with articles")
    parser.add_argument("--date", help="Initial date for articles in format yyyy-mm-dd")
    parser.add_argument("--auto-login", action="store_true", help="Enable auto-login for demo user")
    args = parser.parse_args()

    # Parse the date if provided
    initial_date = None
    if args.date:
        initial_date = parse_date_argument(args.date)
        print(f"Using initial date: {initial_date.strftime('%Y-%m-%d')}")

    await init_db()
    await seed_initial_data(initial_date)

    if args.auto_login:
        auto_login_config = {
            "autoLogin": True,
            "email": "demo@example.com",
            "password": "demo1234"
        }

        import json
        auto_login_path = pathlib.Path("frontend/public/auto-login.json")
        with open(auto_login_path, 'w') as f:
            json.dump(auto_login_config, f, indent=2)


if __name__ == "__main__":
    asyncio.run(main())

# Made with Bob
