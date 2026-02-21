from fastapi import FastAPI
from app.db.database import Base, engine
from app.routers import audit, auth, calls, dashboard,user,campaigns
from fastapi.middleware.cors import CORSMiddleware
from app.routers import team


app = FastAPI(title="Call Management API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(calls.router)
app.include_router(campaigns.router)
app.include_router(audit.router)
app.include_router(dashboard.router)
app.include_router(team.router)
@app.get("/")
def root():
    return {"message": "Backend is running!"}
