""" User modle"""

from models.Base import Base
from flask_login import UserMixin 
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
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
    username = Column(String(80), unique=True, nullable=False)
    full_name = Column(String(120), nullable=True)
    moods = relationship('Mood', backref='user', lazy=True)