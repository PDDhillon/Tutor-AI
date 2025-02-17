from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model
from langchain import hub
from state import State
import os

class Brain():
    def __init__(self):
          print(os.getenv('GOOGLE_API_KEY'))
          self.llm = ChatGoogleGenerativeAI(
              model='gemini-1.5-pro',
              temperature=0,
              api_key=os.getenv('GOOGLE_API_KEY')
          )
          self.base_prompt = hub.pull("rlm/rag-prompt")

    def ask(self, query: str):
        prompt = ChatPromptTemplate.from_template("Answer the following question: {topic}")
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({"topic": query})
    
    def generate(self, state:State):
        context_content = '\n\n'.join(document.page_content for document in state['context'])
        prompt = self.base_prompt.invoke({"context": context_content, "question": state['question']})
        result = self.llm.invoke(prompt)
        return {"answer": result}
