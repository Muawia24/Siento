""" Module to create a mysql engine """

import os
from models.User import User
from models.Mood import Mood
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

class DB:
    """This class creates the engine for a mysql database
    storage system"""
    all_classes = {
        "User": User,
        "Mood": Mood
    }

    __engine = None
    __session = None

    def __init__(self):
        """Instatiate the engine and drop if test database"""
        self.__engine = create_engine("mysql+mysqldb://{}:{}@{}/{}".format(
            os.environ['MYSQL_USER'],
            os.environ['MYSQL_PWD'],
            os.environ['MYSQL_HOST'],
            os.environ['MYSQL_DB']), pool_pre_ping=True)

        Session = sessionmaker(bind=self.__engine)
        self.__session = Session()