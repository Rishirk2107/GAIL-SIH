import { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const ChatHistory = () => {
    const { chatHistory, setInput, onSent, loading, setRecentPrompt } = useContext(Context);
    const [selectedChat, setSelectedChat] = useState(null);

    // Handles selection of a chat from the history list
    const handleChatSelection = (index) => {
        const selected = chatHistory[index];
        setSelectedChat(selected);
        setInput(''); // Clear the input field when a new chat is selected
        setRecentPrompt(selected.prompt); // Set the recent prompt to the selected chat's prompt
    };

    // Handles input change for continuing the chat
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Handles sending a message to continue the chat
    const handleSend = () => {
        if (selectedChat) {
            onSent(selectedChat.prompt); // Sends the selected chat's prompt
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar: List of all chat history */}
            <div className="w-1/4 bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] font-verdana text-white p-4 space-y-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Chat History</h2>
                <ul className="space-y-2">
                    {chatHistory.map((chat, index) => (
                        <li
                            key={index}
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                selectedChat === chat ? 'bg-gray-800' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => handleChatSelection(index)}
                        >
                            <p className="truncate">{chat.prompt}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content: Display selected chat and allow continuation */}
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                {selectedChat ? (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">Selected Chat</h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                            <p className="font-semibold text-gray-700 mb-2"><strong>Prompt:</strong></p>
                            <p className="text-gray-900 mb-4">{selectedChat.prompt}</p>
                            <p className="font-semibold text-gray-700 mb-2"><strong>Response:</strong></p>
                            <div className="text-gray-900" dangerouslySetInnerHTML={{ __html: selectedChat.response }} />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Continue the chat..."
                                onChange={handleInputChange}
                                value={selectedChat.prompt} // Display the selected chat's prompt
                            />
                            <button
                                className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Select a chat to view and continue.</p>
                )}
            </div>
        </div>
    );
};

export default ChatHistory;
