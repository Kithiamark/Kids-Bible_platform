from fastapi import FastAPI

app = FastAPI(
    title="Kids Bible Learning API",
    version="0.1.0",
    description="Backend API for Kids Bible Learning Platform"
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
