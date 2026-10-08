from pydantic import BaseModel

class ActionItem(BaseModel):
    task: str
    owner: str
    deadline: str


class MeetingAnalysis(BaseModel):
    summary: str
    key_decisions: list[str]
    action_items: list[ActionItem]
    topics: list[str]
    risks: list[str]

class MeetingURLRequest(BaseModel):
    url: str