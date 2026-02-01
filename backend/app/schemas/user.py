from pydantic import BaseModel
from typing import List


class UserBase(BaseModel):
    email: str
    role: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(UserBase):
    pass
