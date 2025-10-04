from sqlalchemy.ext.asyncio import AsyncSession

from bobverse.domain.dtos.tag import TagDTO
from bobverse.domain.repositories.tag import ITagRepository
from bobverse.domain.services.tag import ITagService


class TagService(ITagService):
    """Service to handle article tags logic."""

    def __init__(self, tag_repo: ITagRepository):
        self._tag_repo = tag_repo

    async def get_all_tags(self, session: AsyncSession) -> list[TagDTO]:
        return await self._tag_repo.list(session=session)
