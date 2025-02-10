""" User mosle"""

from engine.db_storage import Base
from flask_login import UserMixin 
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from datetime import datetime


class User(Base, UserMixin):
    """This Class defines User Class which has the following public class
attributes
    - email: string 
    - password: string
    -  created_at: string
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)