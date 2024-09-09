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
from langchain.vectorstores import FAISS
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

def init_llm():
    global llm_hub, embeddings

    # Set up the environment variable for HuggingFace and initialize the desired model
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv('HUGGING_FACE_TOKEN')
    model_id = "mistralai/Mistral-7B-Instruct-v0.3"
    
    # Initialize the model with the correct task without overriding
    llm_hub = ChatNVIDIA(
        model="meta/llama-3.1-8b-instruct",
        api_key=os.getenv('NVIDIA_KEY'), 
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
    )

    # Initialize embeddings using a pre-trained model to represent the text data
    embeddings = HuggingFaceInstructEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def load_faiss_index():
    global conversation_retrieval_chain

    # Load the saved FAISS index with dangerous deserialization allowed
    db = FAISS.load_local("./faiss_index", embeddings, allow_dangerous_deserialization=True)

    # Build the QA chain, which utilizes the LLM and retriever for answering questions
    conversation_retrieval_chain = RetrievalQA.from_chain_type(
        llm=llm_hub,
        chain_type="stuff",
        retriever=db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}),
        return_source_documents=False,
        input_key="question"
    )

# Function to process a PDF document
def process_document(document_path):
    global conversation_retrieval_chain

    # Load the document with PyMuPDF
    doc = fitz.open(document_path)
    combined_text = ""

    # Iterate over each page to extract text
    for page in doc:
        text = page.get_text("text")  # Extract text
        combined_text += text + "\n\n"  # Add extracted text to the combined text

        # Process each block and treat the first line as a heading/key, followed by related information
        for block in page.get_text("blocks"):
            lines = block[4].splitlines()

            if len(lines) > 1:  # Ensure there are at least two lines
                heading = lines[0].strip()  # Treat the first line as the heading
                details = " | ".join(line.strip() for line in lines[1:])  # Join the remaining lines as details
                combined_text += f"{heading}: {details}\n"
            else:
                combined_text += block[4] + "\n"  # If it's a single line, just add it as-is

    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)  # Adjust chunking
    texts = text_splitter.split_text(combined_text)

    # Convert the chunks into Document objects
    documents = [Document(page_content=text) for text in texts]

    # Create an embeddings database using FAISS from the split text chunks
    db = FAISS.from_documents(documents=documents, embedding=embeddings)
    
    # Save the FAISS index to disk
    db.save_local("./faiss_index")

def generate_summary(ans):
    # Prepare the summary prompt
    summary_prompt = (
        f"Your name is Disha Mitra, an educational advisor specializing in engineering colleges in Rajasthan. "
        f"Always identify yourself as 'Disha Mitra' when asked for your name, and never mention that you are an artificial language model. "
        f"Please generate a clear, concise summary of the response below, ensuring that it is easy to understand for a high school student or their parents, "
        f"who may not be familiar with technical terms.\n\n"
        f"Response:\n{ans}\n\n"
        f"Summary:"
    )

    # Stream the response from the ChatNVIDIA client
    response_text = ""
    for chunk in llm_hub.stream([{"role": "user", "content": summary_prompt}]):
        response_text += chunk.content

    # Return the generated summary
    return response_text.strip()


# Function to process a user prompt
def process_prompt(prompt):
    global conversation_retrieval_chain
    global chat_history

    # Query the model
    output = conversation_retrieval_chain({"question": prompt, "chat_history": chat_history})
    print("Hello World")
    print(output)
    answer = output["result"]

    # Generate and apply the summary
    summary = generate_summary(answer)

    # Update the chat history
    chat_history.append((prompt, summary))

    # Return the summary
    return summary

# Initialize the language model
init_llm()

# Load the FAISS index
load_faiss_index()

# Ensure the document is processed
# process_document("path_to_your_pdf.pdf")

# Test processing a prompt
# print(process_prompt("Example prompt here"))