import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

PDF_FOLDER = "./data/reports"
CHROMA_DIR = "./chroma_db"
COLLECTION_NAME = "esg_reports"

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings,
)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

for filename in os.listdir(PDF_FOLDER):
    if not filename.lower().endswith(".pdf"):
        continue

    pdf_path = os.path.join(PDF_FOLDER, filename)
    print(f"Ingesting {pdf_path}...")

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    chunks = []

    for doc in docs:
        split_docs = text_splitter.split_documents([doc])
        for chunk in split_docs:
            chunk.metadata["source"] = filename
            chunks.append(chunk)

    if chunks:
        vector_store.add_documents(chunks)
        print(f"Added {len(chunks)} chunks from {filename} to Chroma.")

print("PDF ingestion complete!")
