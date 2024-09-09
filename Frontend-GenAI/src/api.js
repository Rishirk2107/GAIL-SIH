 import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat';  // Ensure this is the correct URL of your FastAPI server

export const sendPrompt = async (prompt) => {
    try {
        const response = await axios.post(API_URL, {"userMessage": prompt });
        return response.data.botResponse;
    } catch (error) {
        console.error('Error sending prompt to RAG LLM:', error);
        throw error;
    }
};
