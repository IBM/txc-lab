from datetime import datetime

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from bobverse.domain.dtos.tag import TagDTO
from bobverse.domain.mapper import IModelMapper
from bobverse.domain.repositories.article_tag import IArticleTagRepository
from bobverse.infrastructure.models import ArticleTag, Tag


class ArticleTagRepository(IArticleTagRepository):
    """Repository for Article Tag model."""

    def __init__(self, tag_mapper: IModelMapper[Tag, TagDTO]):
        self._tag_mapper = tag_mapper

    async def add_many(
        self, session: AsyncSession, article_id: int, tags: list[str]
    ) -> list[TagDTO]:
        insert_query = (
            insert(Tag)
            .on_conflict_do_nothing()
            .values([dict(tag=tag, created_at=datetime.now()) for tag in tags])
        )
        await session.execute(insert_query)

        select_query = select(Tag).where(Tag.tag.in_(tags))
        tags = await session.scalars(select_query)
        tags = [self._tag_mapper.to_dto(tag) for tag in tags]

        link_query = (
            insert(ArticleTag)
            .on_conflict_do_nothing()
            .values(
                [
                    dict(
                        article_id=article_id, tag_id=tag.id, created_at=datetime.now()
                    )
                    for tag in tags
                ]
            )
        )
        await session.execute(link_query)

        return tags

    async def list(self, session: AsyncSession, article_id: int) -> list[TagDTO]:
        query = (
            select(Tag, ArticleTag)
            .where(
                (ArticleTag.article_id == article_id) & (ArticleTag.tag_id == Tag.id)
            )
            .order_by(Tag.created_at.desc())
        )
        tags = await session.scalars(query)
        return [self._tag_mapper.to_dto(tag) for tag in tags]
