from fastapi import APIRouter

from bobverse.api.schemas.responses.tag import TagsResponse
from bobverse.core.dependencies import DBSession, ITagService

router = APIRouter()


@router.get("", response_model=TagsResponse)
async def get_all_tags(session: DBSession, tag_service: ITagService) -> TagsResponse:
    """
    Return available all tags.
    """
    tags = await tag_service.get_all_tags(session=session)
    return TagsResponse.from_dtos(dtos=tags)
