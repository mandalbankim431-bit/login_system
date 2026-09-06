from fastapi import FastAPI, Depends

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import (
    Base,
    engine,
    get_db
)

from models import User

from schemas import UserResponse

from auth import get_current_user

from routers.auth_router import router as auth_router


# ===============================
# DATABASE
# ===============================

Base.metadata.create_all(bind=engine)


# ===============================
# APP
# ===============================

app = FastAPI(
    title="AASIST Login System",
    version="1.0"
)


# ===============================
# CORS
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# ROUTERS
# ===============================

app.include_router(auth_router)


# ===============================
# HOME
# ===============================

@app.get("/")
def home():

    return {
        "message": "AASIST Authentication Server Running"
    }


# ===============================
# CURRENT USER
# ===============================

@app.get(
    "/me",
    response_model=UserResponse
)
def me(
    current_user: User = Depends(get_current_user)
):

    return current_user


# ===============================
# DASHBOARD
# ===============================

@app.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user)
):

    return {
        "message": f"Welcome {current_user.name}",
        "user_id": current_user.id,
        "email": current_user.email
    }