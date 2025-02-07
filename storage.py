from langchain_pinecone import PineconeVectorStore
from langchain_pinecone import PineconeEmbeddings
from pinecone import Pinecone, ServerlessSpec
import time
from state import State
import os

class Storage():
    def __init__(self, index_name : str):
        self.pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        self.embeddings = PineconeEmbeddings(model='multilingual-e5-large', pinecone_api_key=os.getenv('PINECONE_API_KEY'))

        if index_name not in self.pc.list_indexes().names():
            self.pc.create_index(name=index_name, 
                            dimension=self.embeddings.dimension, metric='cosine', 
                            spec=ServerlessSpec(cloud='aws', region='us-east-1'))

            while not self.pc.describe_index(index_name).status['ready']:
                time.sleep(1)

        print(self.pc.Index(index_name).describe_index_stats())
        print("\n")

        self.index = self.pc.Index(index_name)
        self.vector_store = PineconeVectorStore(embedding=self.embeddings, index=self.index)

    def index_data(self, data):
        _ = self.vector_store.add_documents(documents=data)

    def retrieve(self, state: State):
        result = self.vector_store.similarity_search(state['question'])
        return {"context": result}