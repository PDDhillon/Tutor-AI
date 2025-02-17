from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File
from fastapi import UploadFile
from fastapi import Form
from brain import Brain
import uvicorn
from fastapi.responses import JSONResponse
from langgraph.graph import START, StateGraph
from state import State
from storage import Storage
from cleaner import Cleaner
import boto3
from datetime import datetime

app = FastAPI()
brain = Brain()
storage = Storage('test-index')
cleaner = Cleaner()
s3_client = boto3.client('s3')

graph_builder = StateGraph(State).add_sequence([storage.retrieve_old, brain.generate])
graph_builder.add_edge(START, "retrieve_old")
graph = graph_builder.compile()

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

@app.post('/index')
async def index(file: UploadFile = File(...)):
  filename = f'{datetime.today().strftime("%d-%m-%yT%H%M%S")}-{file.filename}'
  s3_client.upload_fileobj(file.file, 'pdbucketdev', filename)
  print(filename)
  clean_data = await cleaner.clean_data(filename)
  print("Data cleaned:", clean_data)
  storage.index_data(clean_data)
  print("Index:", storage.index.describe_index_stats())
  return JSONResponse({"message": clean_data != None})

@app.post('/generate')
def generate(question: str):  
  response = graph.invoke({"question": question})
  return {"message": response["answer"]}

if __name__ == '__main__':
  uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)