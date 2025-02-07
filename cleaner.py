from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import S3FileLoader
import bs4

class Cleaner():
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

    def get_test_data(self):
        loader =  WebBaseLoader(
                web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
                bs_kwargs=dict(
                parse_only=bs4.SoupStrainer(
                    class_=("post-content", "post-title", "post-header")
                )
            ),
        )
        docs = loader.load();
        split_data = self.text_splitter.split_documents(docs);
        return split_data
    
    async def clean_data(self, filename:str):
        loader = S3FileLoader('pdbucketdev', filename)
        docs = loader.load();
        split_data = self.text_splitter.split_documents(docs);
        return split_data
        
        