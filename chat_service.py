from langgraph.graph import MessagesState
from storage import Storage
from cleaner import Cleaner
from langchain_core.messages import SystemMessage
from langchain.tools.base import StructuredTool
from langgraph.prebuilt import ToolNode
from langchain.chat_models import init_chat_model
import boto3
from datetime import datetime

class ChatService():
    def __init__(self):
        self.storage = Storage('test-index')
        self.llm = init_chat_model('gemini-1.5-pro', model_provider='google_genai')
        self.tools = ToolNode([self.storage.retrieve])
        self.s3_client = boto3.client('s3')
        self.cleaner = Cleaner()

    def query_or_respond(self, state: MessagesState):
        llm_with_tools = self.llm.bind_tools([StructuredTool.from_function(func=self.storage.retrieve, response_format="content_and_artifact", name="retrieve")])
        response = llm_with_tools.invoke(state["messages"])
        return {"messages": [response]}    
    
    def generate(self, state: MessagesState):
        """Generate a response to a user query"""
        print("Generating response")
        recent_tool_messages = []
        for message in reversed(state["messages"]):
            if message.type == "tool":
                recent_tool_messages.append(message)
            else:
                break
        tool_messages = recent_tool_messages[::-1]

        docs_content = "\n\n".join(doc.content for doc in tool_messages)
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know. Use three sentences maximum and keep the "
            "answer concise."
            "\n\n"
            f"{docs_content}"
        )
        conversation_messages = [message 
                                 for message in state["messages"] 
                                 if message.type in ("human", "system")
                                 or (message.type == "ai" and not message.tool_calls)]
        prompt = [SystemMessage(system_prompt)] + conversation_messages
        
        response = self.llm.invoke(prompt)
        return {"messages": [response]}

    async def index(self, file):
        """Index a file"""
        filename = f'{datetime.today().strftime("%d-%m-%yT%H%M%S")}-{file.filename}'
        self.s3_client.upload_fileobj(file.file, 'pdbucketdev', filename)
        print(filename)
        clean_data = await self.cleaner.clean_data(filename)
        print("Data cleaned:", clean_data)
        self.storage.index_data(clean_data)
        return {"message": "File indexed successfully"}
    