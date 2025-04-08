# Tutor-AI

Tutor-AI is a study companion app that demonstrates the power of Retrieval Augmented Generation (RAG) for helping students understand and explore complex material. By combining cutting-edge AI with your own source documents, Tutor-AI answers questions contextually and accurately — making studying smarter and more efficient.

### 🔍 How It Works
Tutor-AI uses:
- Google Gemini for powerful language understanding
- LangGraph to orchestrate multi-step reasoning over documents
- React + Shadcn to deliver a clean, modern user interface
  
This project showcases the efficacy of RAG-based systems in educational settings, turning raw content into interactive, intelligent study help.

Created by [Pavundeep Dhillon](https://www.linkedin.com/in/pavundeep-dhillon-86a505138/).

## 1. Usage
To use the final solution, clone the reppository and run the ```tutor-ai``` folder for the React application and the ```chat_api.py``` file for the API.

## 2. Specifications

### 2.1 Technolgies/Libraries Used

- Python
  - LangChain
    - LangSmith
    - LangGraph
  - FastAPI
  - Uvicorn
  - Pydantic
  - Boto3
  - pip & miniconda
- Javascript/CSS/HTML
  - React
  - Shadcn
- Cloud Services
  - AWS
    - S3

### 2.2 File Structure
```
study-buddy/
├── tutorai/
│ ├── app/
│ │  ├── favicon.ico
│ │  ├── globals.css
│ │  ├── layout.tsx
│ │  └── page.tsx
│ ├── components/
│ │  ├── ui/
│ │  ├── AppSidebar.tsx
│ │  ├── ChatWindow.tsx
│ │  ├── Message.tsx
│ │  └── UploadButton.tsx
│ ├── hooks/
│ │  ├── use-mobile.tsx
│ │  └── use-toast.ts
│ ├── interfaces/
│ │  └── IMessage.ts
│ ├── lib/
│ │  └── utils.ts
├── api.py
├── brain.py
├── chat_api.py
├── chat_service.py
├── cleaner.py
├── package-lock.json
├── package.json
├── README.md
├── state.py
├── storage.py
└── tests.ipynb 
```

## 3. Process
### 3.1 Problem Definition
The specific student needs or study challenges the app is designed to address, and why RAG is a good fit.

### 3.2 Data Preparation & Chunking Strategy
How study material is sourced, cleaned, chunked, and embedded — crucial for RAG performance

### 3.3 LangGraph and Prompt Engineering
How LangGraph was used to build reasoning workflows and how prompts were iterated for better responses.

### 3.4 Frontend Design
Discuss integrating the AI backend with the React + Shadcn frontend and designing a smooth, helpful UI.

### 3.5 Testing, Evaluation & Iteration
How I tested retrieval quality, response relevance, and overall user experience

## 4. Improvements and lessons learned
