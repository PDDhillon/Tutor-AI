from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import JSONResponse
from langgraph.graph import END, StateGraph, MessagesState
from langgraph.prebuilt import tools_condition
from chat_service import ChatService
from fastapi.responses import StreamingResponse 
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, ToolMessage
from typing import Annotated
import time

app = FastAPI()

chatservice = ChatService()
memory = MemorySaver()
config = {"configurable": {"thread_id": "abc123"}}
graph_builder = StateGraph(MessagesState)
graph_builder.add_node(chatservice.query_or_respond)
graph_builder.add_node(chatservice.tools)
graph_builder.add_node(chatservice.generate)
print(graph_builder.nodes)
graph_builder.set_entry_point("query_or_respond")
graph_builder.add_conditional_edges("query_or_respond", tools_condition, {END : END, "tools": "tools"})
graph_builder.add_edge("tools", "generate")
graph_builder.add_edge("generate", END)
graph = graph_builder.compile(checkpointer=memory)


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

@app.post('/generate')
def generate(question: str):  
  for step in graph.stream({"messages": [{"role":"user", "content": question}]}, stream_mode="values", config=config):
    step["messages"][-1].pretty_print()
  return {"message": "done"}

def chat_stream(query: str):
  for msg, metadata in graph.stream({"messages": [{"role":"user", "content": query}]}, stream_mode="messages", config=config):      
    if not msg.content or isinstance(msg, ToolMessage):
        continue
    else:
        event_str = "event: ai_event"
    data_str = f"data: {msg.content}"
    yield f"{event_str}\n{data_str}\n\n"


@app.post('/chat')
def chat(query: Annotated[str, Body(embed=True)]):
  return StreamingResponse(chat_stream(query), media_type="text/event-stream")

if __name__ == '__main__':
  uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)