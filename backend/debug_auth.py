
import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add parent dir to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.models.user import User
from app.core.security import create_access_token, decode_token

# Use the dev database
DATABASE_URL = "sqlite:///./dev.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_users():
    session = SessionLocal()
    try:
        users = session.query(User).all()
        print(f"Total users in DB: {len(users)}")
        for user in users:
            print(f"User: ID={user.id}, Email={user.email}, Role={user.role}, Active={user.is_active}")
            
            # Try to generate a token for this user
            token_data = {"sub": str(user.id)}
            token = create_access_token(token_data)
            print(f"Generated Token for User {user.id}: {token[:20]}...")
            
            # Decode it
            try:
                payload = decode_token(token)
                print(f"Decoded Payload: {payload}")
                user_id_from_token = int(payload.get("sub"))
                print(f"User ID from token: {user_id_from_token} (type: {type(user_id_from_token)})")
                
                # Verify DB match
                if user_id_from_token == user.id:
                    print("SUCCESS: Token sub matches DB ID.")
                else:
                    print("FAILURE: Token sub does not match DB ID.")
                    
            except Exception as e:
                print(f"Token verification failed: {e}")
                
        if not users:
            print("No users found in database.")
            
    except Exception as e:
        print(f"Error querying users: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    print(f"Checking database at: {DATABASE_URL}")
    print(f"Using Secret Key: {settings.secret_key}")
    check_users()
