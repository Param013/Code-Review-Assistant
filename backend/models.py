from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255))
    filename = Column(String(255))
    language = Column(String(64))
    report = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
