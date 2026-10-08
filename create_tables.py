from app.database.database import engine, Base
from app.database.models import Meeting, ActionItem


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")