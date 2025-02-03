from langchain_pinecone import PineconeVectorStore
from langchain_google_vertexai import VertexAIEmbeddings
from pinecone import Pinecone
from state import State
import os

class data():
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        self.index = self.pc.Index('test_index')
        self.embeddings = VertexAIEmbeddings(model='text-embedding-004')
        self.vector_store = PineconeVectorStore(embedding=self.embeddings, index=self.index)

    def index(self, data):
        _ = self.vector_store.add_documents(documnents=data)

    def retrieve(self, state: State):
        result = self.vector_store.similarity_search(state['question'])
        return {"context": result}