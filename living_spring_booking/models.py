from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Define db here

class SomeModel(db.Model):  # Define your model
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<SomeModel {self.name}>'

# Import db only after defining it to avoid circular import
from app import db
