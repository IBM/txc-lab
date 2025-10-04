from bobverse.domain.dtos.tag import TagDTO
from bobverse.domain.mapper import IModelMapper
from bobverse.infrastructure.models import Tag


class TagModelMapper(IModelMapper[Tag, TagDTO]):

    @staticmethod
    def to_dto(model: Tag) -> TagDTO:
        dto = TagDTO(id=model.id, tag=model.tag, created_at=model.created_at)
        return dto

    @staticmethod
    def from_dto(dto: TagDTO) -> Tag:
        model = Tag(tag=dto.tag)
        if hasattr(dto, "id"):
            model.id = dto.id
        return model
