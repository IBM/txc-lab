from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from bobverse.domain.dtos.tag import TagDTO
from bobverse.domain.mapper import IModelMapper
from bobverse.domain.repositories.tag import ITagRepository
from bobverse.infrastructure.models import Tag


class TagRepository(ITagRepository):
    """Repository for Tag model."""

    def __init__(self, tag_mapper: IModelMapper[Tag, TagDTO]):
        self._tag_mapper = tag_mapper

    async def list(self, session: AsyncSession) -> list[TagDTO]:
        query = select(Tag)
        tags = await session.scalars(query)
        return [self._tag_mapper.to_dto(tag) for tag in tags]
