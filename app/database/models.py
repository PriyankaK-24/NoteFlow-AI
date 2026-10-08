from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    key_decisions = Column(Text, nullable=True)
    topics = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    action_items = relationship(
        "ActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan"
    )


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id"),
        nullable=False
    )
    task = Column(Text, nullable=False)
    owner = Column(String(255), nullable=True)
    deadline = Column(String(255), nullable=True)
    status = Column(String(50), default="Pending")

    meeting = relationship(
        "Meeting",
        back_populates="action_items"
    )