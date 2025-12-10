from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
import urllib.parse
import requests
from dotenv import load_dotenv
import uuid



# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://michelangelo:michelangelo123@db:5432/michelangelo"
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")


# -----------------------------
# Database setup
# -----------------------------
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

# -----------------------------
# Password hashing setup
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BCRYPT_MAX_LENGTH = 72  # bcrypt max password length

# -----------------------------
# JWT OAuth2 setup
# -----------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# -----------------------------
# FastAPI app setup
# -----------------------------
app = FastAPI(title="User Auth API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Database models
# -----------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    macb_id = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    nickname = Column(String)
    phone = Column(String)
    facebook = Column(String)
    instagram = Column(String)
    linkedin = Column(String)


Base.metadata.create_all(bind=engine)

# -----------------------------
# Pydantic schemas
# -----------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        from_attributes = True

class RegisterResponse(BaseModel):
    message: str
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str


# -----------------------------
# Utility functions
# -----------------------------
def generate_macb_id():
    return "mach." + uuid.uuid4().hex[:16]

def get_password_hash(password: str) -> str:
    truncated_password = password[:BCRYPT_MAX_LENGTH]
    return pwd_context.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated_password = plain_password[:BCRYPT_MAX_LENGTH]
    return pwd_context.verify(truncated_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


import uuid  # ✅ Add this at the top

# -----------------------------
# Auth routes
# -----------------------------
@app.post("/register", response_model=RegisterResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if len(user.password) > BCRYPT_MAX_LENGTH:
        raise HTTPException(status_code=400, detail=f"Password too long, max {BCRYPT_MAX_LENGTH} chars")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)

    # ✅ Generate a unique, permanent macb_id for this user
    macb_id = f"macb-{uuid.uuid4().hex[:16]}"

    # ✅ Include macb_id in the User model
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        macb_id=macb_id
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token({"sub": db_user.email})

    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "macbId": db_user.macb_id  # ✅ Include in response
    }


@app.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    email_or_username = user.email_or_username.strip()
    password = user.password.strip()

    # HTML5 required fields handle empty input, so no need to check here

    # Find user by email or username
    if "@" in email_or_username:
        db_user = db.query(User).filter(User.email.ilike(email_or_username)).first()
    else:
        db_user = db.query(User).filter(User.username == email_or_username).first()

    # User does not exist → Invalid Username or Email
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Username or Email")

    # User exists, password wrong → Invalid Password
    if not verify_password(password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    # Success
    access_token = create_access_token({"sub": db_user.email})
    return {"message": "Login successful", "access_token": access_token, "token_type": "bearer"}




# -----------------------------
# Google OAuth routes
# -----------------------------
@app.get("/auth/google")
def auth_google():
    google_auth_base = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    url = f"{google_auth_base}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=url)

@app.get("/auth/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    # Exchange code for token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    token_response = requests.post(token_url, data=data).json()
    access_token = token_response.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    # Get user info
    userinfo_response = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    email = userinfo_response.get("email")
    name = userinfo_response.get("name")
    if not email:
        raise HTTPException(status_code=400, detail="Failed to get user email")

    # Check/create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        hashed_password = get_password_hash(os.urandom(12).hex())
        username_base = email.split("@")[0]
        counter = 1
        macb_id = f"macb-{uuid.uuid4().hex[:16]}"
        username = username_base
        while db.query(User).filter(User.username == username).first():
            username = f"{username_base}{counter}"
            counter += 1
        user = User(username=username, email=email, hashed_password=hashed_password, macb_id=macb_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create JWT
    jwt_token = create_access_token({"sub": user.email})
    frontend_url = f"http://localhost:3000/dashboard_page?token={jwt_token}"
    return RedirectResponse(url=frontend_url)

# -----------------------------
# Utility routes
# -----------------------------
@app.get("/check-username")
def check_username(username: str = Query(...), db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == username).first() is not None
    return {"exists": exists, "message": "Username is taken" if exists else "Username is available"}

@app.get("/check-email")
def check_email(email: str = Query(...), db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == email).first() is not None
    return {"exists": exists, "message": "Email is already registered" if exists else "Email is available"}

from fastapi import Body
from fastapi.responses import JSONResponse
import smtplib
from email.mime.text import MIMEText

from pydantic import BaseModel, EmailStr

class ForgetPasswordRequest(BaseModel):
    email: EmailStr

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta
import smtplib
from email.mime.text import MIMEText
import os
from jose import jwt


class ForgetPasswordRequest(BaseModel):
    email: EmailStr

@app.post("/forget-password")
def forget_password(request: ForgetPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Email")

    # Token valid for 15 minutes
    reset_token = create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=15))
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    # Send email via Mailtrap
    try:
        msg = MIMEText(f"Click the link to reset your password:\n\n{reset_link}")
        msg['Subject'] = "Password Reset Request"
        msg['From'] = os.getenv("EMAIL_FROM")
        msg['To'] = user.email

        server = smtplib.SMTP(os.getenv("EMAIL_SERVER"), int(os.getenv("EMAIL_PORT")))
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        server.sendmail(msg['From'], [msg['To']], msg.as_string())
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"message": "Check your email for the reset link."}

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jose import jwt

class ForgetPasswordRequest(BaseModel):
    email: EmailStr

@app.post("/forget-password")
def forget_password(request: ForgetPasswordRequest, db: Session = Depends(get_db)):
    # Check user existence
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Email")

    # Create reset token (valid 15 minutes)
    reset_token = create_access_token(
        {"sub": user.email},
        expires_delta=timedelta(minutes=15)
    )
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    # Create HTML email
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Hello {user.username},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #3A6A3B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                   Reset Password
                </a>
            </p>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <p>Ignore this email if you did not request a password reset.</p>
            <hr>
            <p style="font-size: 12px; color: gray;">© 2025 M.A.C.B., Inc. All Rights Reserved.</p>
        </body>
    </html>
    """

    # Prepare email message
    msg = MIMEMultipart("alternative")
    msg['Subject'] = "Reset Your Password"
    msg['From'] = os.getenv("EMAIL_FROM", "no-reply@example.com")
    msg['To'] = user.email
    msg.attach(MIMEText(html_content, "html"))  # HTML only

    # Send via SMTP (Mailtrap)
    try:
        server = smtplib.SMTP(os.getenv("EMAIL_SERVER"), int(os.getenv("EMAIL_PORT")))
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        server.sendmail(msg['From'], [msg['To']], msg.as_string())
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"message": "Check your email for the password reset link."}


from fastapi import Body, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password reset successfully"}

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "macb_id": current_user.macb_id,
        "full_name": current_user.full_name,
        "nickname": current_user.nickname,
        "phone": current_user.phone,
        "facebook": current_user.facebook,
        "instagram": current_user.instagram,
        "linkedin": current_user.linkedin,
    }

class UpdateProfileRequest(BaseModel):
    username: Optional[str]
    full_name: Optional[str]
    nickname: Optional[str]
    phone: Optional[str]
    facebook: Optional[str]
    instagram: Optional[str]
    linkedin: Optional[str] 

@app.put("/profile")
def update_profile(update: UpdateProfileRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully"}

from sqlalchemy import Float

# -----------------------------
# Financial Data model
# -----------------------------
class FinancialData(Base):
    __tablename__ = "financial_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    macb_id = Column(String, nullable=False)  
    email = Column(String, nullable=False)
    date = Column(String, nullable=False)
    financial_choice = Column(String, nullable=False)
    type = Column(String, nullable=False)
    unit_type = Column(String, nullable=False)  # <-- now required
    amount = Column(Float, nullable=False)      # store as numeric
    per_unit = Column(Float, nullable=False)    # store as numeric

# -----------------------------
# Pydantic schema for input
# -----------------------------
class FinancialDataCreate(BaseModel):
    date: str
    financial_choice: str
    type: str
    unit_type: str  # required
    amount: float
    per_unit: float

# -----------------------------
# Routes
# -----------------------------
@app.post("/import-data")
def import_data(
    data: FinancialDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_entry = FinancialData(
        user_id=current_user.id,
        date=data.date,
        macb_id=current_user.macb_id,
        email=current_user.email,
        financial_choice=data.financial_choice,
        type=data.type,
        unit_type=data.unit_type,
        amount=data.amount,
        per_unit=data.per_unit,
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return {"message": "Data imported successfully", "data_id": new_entry.id}


@app.get("/dashboard-data")
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(FinancialData).filter(FinancialData.user_id == current_user.id).all()
    return [
        {
            "id": e.id,
            "date": e.date,
            "financial_choice": e.financial_choice,
            "type": e.type,
            "unit_type": e.unit_type,
            "amount": e.amount,
            "per_unit": e.per_unit
        }
        for e in entries
    ]

from fastapi import Path

# Delete financial entry
@app.delete("/dashboard-data/{item_id}")
def delete_financial_data(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(FinancialData).filter(FinancialData.id == item_id, FinancialData.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(entry)
    db.commit()
    return {"message": "Item deleted successfully"}

# Update financial entry
from pydantic import BaseModel

class FinancialDataUpdate(BaseModel):
    financial_choice: str
    type: str
    unit_type: str
    amount: float
    per_unit: float

@app.patch("/dashboard-data/{item_id}")
def update_financial_data(item_id: int, update: FinancialDataUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(FinancialData).filter(FinancialData.id == item_id, FinancialData.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Item not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return {"message": "Entry updated successfully", "data": {
        "id": entry.id,
        "date": entry.date,
        "financial_choice": entry.financial_choice,
        "type": entry.type,
        "unit_type": entry.unit_type,
        "amount": entry.amount,
        "per_unit": entry.per_unit
    }}