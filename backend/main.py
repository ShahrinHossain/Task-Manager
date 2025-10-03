from fastapi import FastAPI, Body

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/tasks")
def get_tasks():
    return {"data": "These are your data"}

@app.post("/add_tasks")
def add_tasks(payload: dict = Body(...)):
    print(payload)
    return {"message": "successfully created"}