from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from sentence_transformers import SentenceTransformer

app = FastAPI(title="RAG PDF Chatbot API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ChromaDB
client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_collection(
    name="college_students"
)

# Embedding Model
model = SentenceTransformer("all-MiniLM-L6-v2")


class Question(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "RAG PDF Chatbot API is running"
    }


@app.post("/ask")
def ask_question(data: Question):

    query_embedding = model.encode(
        [data.question]
    ).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=2
    )

    return {
        "question": data.question,
        "answer": results["documents"]
    }