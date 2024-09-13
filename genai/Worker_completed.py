import os
import torch
import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFaceEndpoint
from langchain.docstore.document import Document

# Load environment variables
load_dotenv()

# Check for GPU availability and set the appropriate device for computation
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

# Global variables
conversation_retrieval_chain = None
chat_history = []
llm_hub = None
embeddings = None
docs=False

def init_llm():
    global llm_hub, embeddings

    # Set up the environment variable for HuggingFace and initialize the desired model
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv('HUGGING_FACE_TOKEN')
    model_id = "mistralai/Mistral-7B-Instruct-v0.3"
    
    # Initialize the model with the correct task without overriding
    llm_hub = ChatNVIDIA(
        model="meta/llama-3.1-8b-instruct",
        api_key=os.getenv("NVIDIA_KEY"), 
        temperature=0.2,
        top_p=0.7,
        max_tokens=200,
    )

    # Initialize embeddings using a pre-trained model to represent the text data
    embeddings = HuggingFaceInstructEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def load_faiss_index():
    global conversation_retrieval_chain
    if os.path.isdir("./faiss_index"):

        # Load the saved FAISS index with dangerous deserialization allowed
        db = FAISS.load_local("./faiss_index", embeddings, allow_dangerous_deserialization=True)

        # Build the QA chain, which utilizes the LLM and retriever for answering questions
        conversation_retrieval_chain = RetrievalQA.from_chain_type(
            llm=llm_hub,
            chain_type="stuff",
            retriever=db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}),
            return_source_documents=True,
            input_key="question"
        )

# Function to process a PDF document
def process_document(document_path):
    global conversation_retrieval_chain,docs

    # Load the document with PyMuPDF
    doc = fitz.open(document_path)
    combined_text = ""

    # Iterate over each page to extract text
    for page in doc:
        text = page.get_text("text")  # Extract text
        combined_text += text + "\n\n"  # Add extracted text to the combined text

    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)  # Adjust chunking
    texts = text_splitter.split_text(combined_text)

    # Convert the chunks into Document objects
    documents = [Document(page_content=text) for text in texts]

    if os.path.isdir("./faiss_index"):
        # Load the existing FAISS index
        db = FAISS.load_local("./faiss_index", embeddings, allow_dangerous_deserialization=True)
        # Add the new documents to the existing index
        db.add_documents(documents)
    else:
        # Create a new FAISS index if it doesn't exist
        db = FAISS.from_documents(documents=documents, embedding=embeddings)
    
    # Save the FAISS index to disk
    db.save_local("./faiss_index")
    conversation_retrieval_chain = RetrievalQA.from_chain_type(
            llm=llm_hub,
            chain_type="stuff",
            retriever=db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}),
            return_source_documents=True,
            input_key="question"
        )
    docs=True
    

def process_prompt(prompt):
    global conversation_retrieval_chain
    global chat_history
    global docs

    # Query the model to get the answer and source documents
    output = conversation_retrieval_chain({"question": prompt, "chat_history": chat_history})
    answer = output["result"]
    sources = output["source_documents"]
    if(docs):
        # Prepare the structured input using the extracted sources
        structured_input = f"""
        The following are extraction from various documents related to the question: '{prompt}'.
        Please organize the content into subheadings and contents based on their relevance and give it relevant contents in a brief way:

        """
        
        for i, doc in enumerate(sources):
            # Add each source document's content
            structured_input += f"Source {i + 1}:\n{doc.page_content.strip()}\n\n"
        
        # Create a prompt for structuring the content
        structuring_prompt = f"""
        Please organize the following text into clear subheadings and contents:
        {structured_input}
        """

        # Stream the structured output from the LLM using ChatNVIDIA
        structured_output = ""
        for chunk in llm_hub.stream([{"role": "user", "content": structuring_prompt}]):
            structured_output += chunk.content

        # Combine the answer and structured output into a single string
        combined_output = f"**Answer:**\n{answer}\n\n**Extraction:**\n{structured_output}"

        return combined_output
    return answer


# Initialize the language model
init_llm()

# Load the FAISS index
load_faiss_index()

# Ensure the document is processed
# process_document("path_to_your_pdf.pdf")

# Test processing a prompt
# print(process_prompt("Example prompt here"))