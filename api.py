from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File
from fastapi import UploadFile
from fastapi import Form
from brain import Brain
import uvicorn
from fastapi.responses import JSONResponse

app = FastAPI()
brain = Brain()
print("Starting server")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/healthcheck')
def healthcheck():
  msg = "API is up and running!"  
  return {"message": msg}

@app.post('/chat')
def chat(query: str):
  result = brain.ask(query)
  return JSONResponse(content={
    "question":query,
    "answer": result  
    })

if __name__ == '__main__':
  uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)