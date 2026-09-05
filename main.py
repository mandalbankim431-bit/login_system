from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User
from schemas import (
    SignupRequest,
    LoginRequest,
    UserResponse,
    TokenResponse
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

# Create database tables

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="AASIST Login System",
    version="1.0"
)


# =========================
# HOME
# =========================

@app.get("/")
def home():

    return {
        "message": "AASIST Authentication Server Running"
    }


# =========================
# SIGNUP
# =========================

@app.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def signup(

    data: SignupRequest,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(

        name=data.name,

        email=data.email,

        password=hash_password(
            data.password
        )
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


# =========================
# LOGIN
# =========================

@app.post(
    "/login",
    response_model=TokenResponse
)
def login(

    data: LoginRequest,

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = verify_password(

        data.password,

        user.password
    )

    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        user.id
    )

    return {

        "access_token": token,

        "token_type": "bearer"
    }


# =========================
# CURRENT USER
# =========================

@app.get(
    "/me",
    response_model=UserResponse
)
def me(

    current_user: User = Depends(
        get_current_user
    )

):

    return current_user


# =========================
# PROTECTED DASHBOARD
# =========================

@app.get("/dashboard")
def dashboard(

    current_user: User = Depends(
        get_current_user
    )

):

    return {

        "message": f"Welcome {current_user.name}",

        "user_id": current_user.id,

        "email": current_user.email
    }