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
    global conversation_retrieval_chain

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

    # Create an embeddings database using FAISS from the split text chunks
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

def generate_reference_clause(extraction):
    matching_prompt = (
        f"Identify and return the most relevant heading and name it as Heading. The heading should be selected based on the presence of a line that starts with either a number, a Roman numeral, or a newline character and ends with a colon, or starts and ends with two newline characters.\n\n"
        f"Text:\n{extraction}\n\n"
        f"Relevant Heading:"
    )
    
    # Create a list of messages
    messages = [{"role": "user", "content": matching_prompt}]
    
    # Initialize an empty string to hold the response
    matching_term = ""
    
    # Stream the response
    for chunk in llm_hub.stream(messages):
        matching_term += chunk.content
    
    return f"Heading: {matching_term.strip()}"

def generate_summary(extraction, prompt):
    summary_prompt = (
        f"Based on the following extraction and the question, provide a detailed summary if the question is available in the PDF, otherwise indicate unavailability:\n\n"
        f"Extraction:\n{extraction}\n\n"
        f"Question:\n{prompt}\n\n"
        f"Summary:"
    )
    
    # Create a list of messages
    messages = [{"role": "user", "content": summary_prompt}]
    
    # Initialize an empty string to hold the response
    generated_text = ""
    
    # Stream the response
    for chunk in llm_hub.stream(messages):
        generated_text += chunk.content
    
    return generated_text.strip()



def process_prompt(prompt):
    global conversation_retrieval_chain
    global chat_history

    # Query the model
    output = conversation_retrieval_chain({"question": prompt, "chat_history": chat_history})
    answer = output["result"]
    # sources = output["source_documents"]
    # print(sources)

    # # If there are no source documents or the answer is too vague, return "I don't know."
    # if not sources or len(answer.strip()) == 0 or "I don't know" in answer.lower():
    #     return "I don't know the answer to that."

    # extraction = "\n".join([source.page_content for source in sources])

    # # Generate and apply the summary
    # summary = generate_summary(extraction, answer)
    # reference = generate_reference_clause(extraction)

    # s = "Reference:\n" + reference + "\n\n"
    # s += ("Extraction:\n" + extraction + "\n\n")
    # s += ("Summary:\n" + summary)

    # # Update the chat history
    # chat_history.append((prompt, s))

    # Return the summary
    return answer

# Initialize the language model
init_llm()

# Load the FAISS index
load_faiss_index()

# Ensure the document is processed
# process_document("path_to_your_pdf.pdf")

# Test processing a prompt
# print(process_prompt("Example prompt here"))