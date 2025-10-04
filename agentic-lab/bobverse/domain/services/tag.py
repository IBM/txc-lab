import abc
from typing import Any

from bobverse.domain.dtos.tag import TagDTO


class ITagService(abc.ABC):

    @abc.abstractmethod
    async def get_all_tags(self, session: Any) -> list[TagDTO]: ...
