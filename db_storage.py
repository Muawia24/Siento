""" Module to create a mysql engine """

import os
from models.User import User
from models.Mood import Mood
from models.Base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()


class DB:
    """This class creates the engine for a mysql database
    storage system"""
    all_classes = {
        "User": User,
        "Mood": Mood
    }

    db_url = f"mysql+mysqldb://{os.environ['MYSQL_USER']}:{os.environ['MYSQL_PWD']}@{os.environ['MYSQL_HOST']}/{os.environ['MYSQL_DB']}"

    __engine = None
    __session = None

    def __init__(self):
        """Instatiate the engine and drop if test database"""
        self.__engine = create_engine(self.db_url, pool_pre_ping=True)

        Session = sessionmaker(bind=self.__engine)
        self.__session = Session()

    def new(self, obj):
        """Add object to current database session"""
        self.__session.add(obj)
        self.__session.flush()

    def save(self):
        """Commit changes to the current databases session"""
        self.__session.commit()

    def delete(self, obj=None):
        """Delete object from the current database session"""
        if obj is not None:
            self.__session.delete(obj)
    def rollback(self):
        """rollback changes to the current databases session"""
        self.__session.rollback()

    def get(self, cls, email):
        """Returns the object based on the class
        and its Email, or None if not found """
        for key, value in self.all_classes.items():
            if value is cls:
                try:
                    return self.__session.query(value).filter(value.email == email).one()
                except:
                    return None
        return None