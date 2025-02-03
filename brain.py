from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
import os

class Brain():
    def __init__(self):
          self.llm = ChatGoogleGenerativeAI(
              model='gemini-1.5-pro',
              temperature=0,
              api_key=os.getenv('GOOGLE_API_KEY')
          )

    def ask(self, query: str):
        prompt = ChatPromptTemplate.from_template("Answer the following question: {topic}")
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({"topic": query})