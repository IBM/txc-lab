# bobverse Backend

A modern backend implementation for the bobverse, a news platform for Bob, using FastAPI and SQLite and a React frontend.

## Introduction

This project is a RESTful API implementation of Bobverse. It provides all the functionality needed to power a social blogging platform including user authentication, article creation and management, commenting, favoriting, and following users. It is based on [realworld](https://github.com/gothinkster/realworld)

## Project Structure

The project follows a clean architecture approach with clear separation of concerns:

```
bobverse/
├── api/                # API layer (FastAPI routes, schemas)
│   ├── routes/         # API endpoints
│   └── schemas/        # Request/response models
├── core/               # Core application components
│   ├── settings/       # Configuration settings
│   └── utils/          # Utility functions
├── domain/             # Domain layer (business logic)
│   ├── dtos/           # Data transfer objects
│   ├── repositories/   # Repository interfaces
│   └── services/       # Business logic services
├── infrastructure/     # Infrastructure layer
│   ├── alembic/        # Database migrations
│   ├── mappers/        # ORM mappers
│   └── repositories/   # Repository implementations
└── services/           # Service implementations
```

## Technology Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - A modern, fast web framework for building APIs
- **Database**: SQLite with [aiosqlite](https://github.com/omnilib/aiosqlite) - Lightweight file-based database
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and Object-Relational Mapper
- **Authentication**: JWT (JSON Web Tokens) with [PyJWT](https://pyjwt.readthedocs.io/)
- **Password Hashing**: [Passlib](https://passlib.readthedocs.io/) with bcrypt
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/) - Database migration tool
- **Testing**: [pytest](https://docs.pytest.org/) with pytest-asyncio for async testing
- **Logging**: [structlog](https://www.structlog.org/) - Structured logging

## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js and npm (for frontend)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Set up the environment:
   ```bash
   make setup
   ```
   This will create a virtual environment, install dependencies, and set up the frontend.

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the values as needed.

4. Initialize the database:
   ```bash
   make init-db
   ```

5. To clean the project (remove database and generated files):
   ```bash
   make clean
   ```

## Database Configuration

The application uses SQLite as its database, which is a file-based database that doesn't require a separate server. The database configuration is defined in `bobverse/core/settings/base.py`.

Key database settings:
- Database path: Configured via the `SQLITE_DB_PATH` environment variable
- Default location: `bobverse.db` in the project root
- Connection string format: `sqlite+aiosqlite:///bobverse.db`

## Running the Application

### Backend Only

```bash
make backend
```
This will start the FastAPI server at http://localhost:8000 with auto-reload enabled.

### Frontend Only

```bash
make frontend
```
This will start the React frontend development server.

### Full Stack (Backend and Frontend)

```bash
make start
```
This will start both the backend and frontend servers concurrently.

### Cleaning the Project

```bash
make clean
```
This will remove the database files and other generated files (like `__pycache__` and `.pytest_cache`), giving you a clean slate.

## Testing

Run the backend tests:

```bash
make test-backend
```

This will execute all tests in the `tests/` directory using pytest.

## API Endpoints

Main endpoints:

- Authentication:
  - `POST /api/users/login` - Login
  - `POST /api/users` - Registration

- User:
  - `GET /api/user` - Get current user
  - `PUT /api/user` - Update user

- Profiles:
  - `GET /api/profiles/{username}` - Get profile
  - `POST /api/profiles/{username}/follow` - Follow user
  - `DELETE /api/profiles/{username}/follow` - Unfollow user

- Articles:
  - `GET /api/articles` - List articles
  - `POST /api/articles` - Create article
  - `GET /api/articles/{slug}` - Get article
  - `PUT /api/articles/{slug}` - Update article
  - `DELETE /api/articles/{slug}` - Delete article
  - `POST /api/articles/{slug}/favorite` - Favorite article
  - `DELETE /api/articles/{slug}/favorite` - Unfavorite article

- Comments:
  - `GET /api/articles/{slug}/comments` - Get comments
  - `POST /api/articles/{slug}/comments` - Add comment
  - `DELETE /api/articles/{slug}/comments/{id}` - Delete comment

- Tags:
  - `GET /api/tags` - Get tags

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Secret key for general encryption | (required) |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | (required) |
| `JWT_TOKEN_EXPIRATION_MINUTES` | JWT token expiration time in minutes | 10080 (1 week) |
| `JWT_ALGORITHM` | Algorithm used for JWT | HS256 |
| `SQLITE_DB_PATH` | Path to SQLite database | sqlite+aiosqlite:///bobverse.db |
| `APP_ENV` | Application environment (prod, dev, test) | prod |

