""" Mood modle"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from models.Base import Base
from datetime import datetime

class Mood(Base):
    """
    """
    __tablename__ = 'moods'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    entry = Column(Text, nullable=False)
    sentiment = Column(String(10), nullable=False)
    score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)