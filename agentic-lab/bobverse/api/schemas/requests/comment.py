from pydantic import BaseModel

from bobverse.domain.dtos.comment import CreateCommentDTO


class CreateCommentData(BaseModel):
    body: str


class CreateCommentRequest(BaseModel):
    comment: CreateCommentData

    def to_dto(self) -> CreateCommentDTO:
        return CreateCommentDTO(body=self.comment.body)
