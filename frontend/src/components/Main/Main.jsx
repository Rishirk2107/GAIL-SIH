/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import axios from 'axios';

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const Main = () => {
    const { showResult, loading, setInput, input, themeColor } = useContext(Context);
    const [shareOpen, setShareOpen] = useState(false);
    const lastMessageRef = useRef(null);
    const inputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showCards, setShowCards] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const chatContainerRef = useRef(null);
    const [hasStartedChatting, setHasStartedChatting] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('English');
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const recognitionRef = useRef(null);
    const [, setMessageSent] = useState(false);
    const [messages, setMessages] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const allSuggestions = [
        "HR policies?",
        "IT support queries?",
        "Company events?",
        "Document analysis?",
        "Document summarization?",
        "Keyword extraction?",
    ];

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (validateEmail(email)) {
            setIsEmailSubmitted(true);
            console.log('Verification code sent to:', email);
        } else {
            alert('Please enter a valid email address.');
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: `File: ${file.name}`, file }]);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:8000/process-document', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (response.data.botResponse) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'bot', text: response.data.botResponse }
                    ]);
                }
            } catch (error) {
                console.error('Error uploading file to server:', error);
            }
        }
    };

    const playMicSound = () => {
        const micSound = new Audio(assets.recognition_sound);
        micSound.play();
    };

    useEffect(() => {
        if (loading) {
            setIsSending(true);
        } else {
            setIsSending(false);
        }
    }, [loading]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                sendMessage(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
            };
        }
    }, []);

    useEffect(() => {
        if (!isSending) {
            const shuffledSuggestions = shuffleArray([...allSuggestions]);
            const randomSuggestions = shuffledSuggestions.slice(suggestionIndex, suggestionIndex + 2);
            setSuggestions(randomSuggestions);
        }
    }, [isSending, suggestionIndex]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, typingMessage, suggestions, isSending]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, isSending]);

    const startVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const sendMessage = async (message) => {
        if (!hasStartedChatting) {
            setHasStartedChatting(true);
        }

        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: message }]);
        setIsSending(true);
        setInput('');
        setMessageSent(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: message }),
            });

            const data = await response.json();
            console.log(data.botResponse);
            simulateTyping(data.botResponse);
        } catch (error) {
            console.error('Error sending message to server:', error);
            setIsSending(false);
        }

        updateSuggestions();
        setShowSuggestions(true);
    };

    const handleLanguageIconClick = () => {
        if (!isSending) {
            setShowLanguageDropdown((prev) => !prev);
        }
    };

    const handleLanguageChange = (language) => {
        setCurrentLanguage(language);
        setShowLanguageDropdown(false);
    };

    const updateSuggestions = () => {
        setSuggestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 2;
            return nextIndex >= allSuggestions.length ? 0 : nextIndex;
        });
    };

    const simulateTyping = (message) => {
        if (!message) return;
    
        setTypingMessage('');
        let currentIndex = 0;
    
        const intervalId = setInterval(() => {
            setTypingMessage((prev) => {
                const newMessage = prev + message[currentIndex];
                currentIndex++;
    
                if (currentIndex === message.length) {
                    clearInterval(intervalId);
    
                    // Check if the last message already exists before appending
                    setMessages((prevMessages) => {
                        const lastMessage = prevMessages[prevMessages.length - 1];
                        if (lastMessage?.text !== message) {
                            return [...prevMessages, { sender: 'bot', text: message }];
                        }
                        return prevMessages;
                    });
    
                    setTypingMessage('');
                    setIsSending(false);
                }
    
                return newMessage;
            });
        }, 9);
    };
    
    const handleCardClick = (text) => {
        sendMessage(text);
    };

    const toggleShare = () => {
        setShareOpen(!shareOpen);
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, typingMessage, suggestions, isSending]);


        return (
            <div className='flex flex-col min-h-screen relative' style={{ backgroundColor: themeColor }}>
                {/* Navbar */}
                <nav className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] shadow-lg">
                    <div className="flex items-center justify-center w-full text-center space-x-4">
                        <div className="text-[#80cbc4] font-bold text-2xl tracking-wide transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-[#80cbc4] bg-clip-text bg-gradient-to-r from-[#ff8a65] to-[#ff7043]">
                            <p style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', letterSpacing: '2px', fontSize: '30px' }}>
                                SEVA MITRA
                            </p>
                        </div>
                    </div>
                    {/* Arrow Icon for Scroll to Input */}
                    <div className="flex items-center space-x-4 relative">
                        <span className="material-symbols-outlined text-white cursor-pointer transition-colors duration-300 hover:text-[#80cbc4]" onClick={toggleShare}>
                            ios_share
                        </span>
                        {shareOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-[#000000] z-20">
                                <div className="bg-gradient-to-r from-[#004d40] to-[#00796b] w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 text-center font-roboto text-white">Share this with others</h2>
                                    <ul className="flex flex-col p-2 space-y-4">
                                        <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                            <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
                                            <p className="text-white font-roboto">WhatsApp</p>
                                        </li>
                                        <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                            <img src="https://img.icons8.com/ios-filled/50/ffffff/telegram-app.png" alt="Telegram" className="w-8 h-8" />
                                            <p className="text-white font-roboto">Telegram</p>
                                        </li>
                                        <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                            <img src="https://img.icons8.com/ios-filled/50/ffffff/gmail-new.png" alt="Gmail" className="w-8 h-8" />
                                            <p className="text-white font-roboto">Gmail</p>
                                        </li>
                                    </ul>
                                    <button className="text-lg w-full mt-4 p-2 bg-[#1a1818] text-white font-bold rounded-lg" onClick={toggleShare}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                        <Link to="/userprofile" className="cursor-pointer">
                            <img src={assets.user_icon} alt="User" className="w-10 rounded-full" />
                        </Link>
                    </div>
                </nav>
        
                <div className="flex-1 max-w-[900px] mx-auto flex flex-col">
                <div className="flex-1 max-w-[900px] mx-auto flex flex-col">
                    {/* Introductory Message */}
                    {!hasStartedChatting && (
        <div className="my-12 text-[38px] md:text-[50px] text-[#00796b] font-medium p-1">
            <p>
                <span className="bg-gradient-to-r from-[#1b7474] via-[#1b7ab1] to-[#065c52] font-verdana font-bold  bg-clip-text text-transparent">
                How may I assist you with your queries today?
                </span>
            </p>
            </div>
            )}
                    {/* Cards Section */}
                    {showLanguageDropdown && (
                    <div className="fixed top-20 bg-gradient-to-r from-[#247267] to-[#00796b] right-4 z-30  shadow-md rounded-lg p-4 w-48 sm:w-60 md:w-72 lg:w-80">
                    <ul className="space-y-2 font-bold font-verdana text-white">
                        {['English', 'Hindi - हिन्दी ', 'Punjabi - ਪੰਜਾਬੀ', 'Gujarati - ગુજરાતી', 'Tamil - தமிழ்'].map((language) => (
                            <li
                                key={language}
                                className="cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out transform  hover:bg-[#48bcab] hover:text-black hover:scale-105 hover:shadow-lg"
                                onClick={() => handleLanguageChange(language)}
                            >
                                {language}
                            </li>
                        ))}
                    </ul>
                </div>
                
                
                    
                )}

                    {showCards && !showResult && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                            {[
                                { icon: assets.compass_icon, text: "Explore PSUs Associated with GAIL" },
                                { icon: assets.college_icon, text: "HR Policies and IT Services of GAIL" },
                                { icon: assets.suitcase_icon, text: "Are there any recent partnerships between GAIL and other PSUs?" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="h-[200px] font-verdana font-bold p-3 bg-[#ffffff] rounded-lg shadow-lg relative cursor-pointer hover:bg-[#74cec3] border-2 border-[#00796b] hover:shadow-xl transition-all duration-300 ease-in-out"
                                    onClick={() => {
                                        handleCardClick(item.text);
                                        setShowCards(false); // Hide cards after clicking
                                    }}
                                    style={{ borderLeft: '5px solid #004d40' }}
                                >
                                    <p className="text-[#004d40] text-[17px] font-semibold">{item.text}</p>
                                    <img
                                        src={item.icon}
                                        alt={item.text}
                                        className="w-9 p-1 absolute bg-[#00796b] text-white rounded-full bottom-2.5 right-2.5 transition-transform duration-300 ease-in-out transform hover:scale-110"
                                    />
                                </div>
                                
                            ))}
                        </div>
                    )}
        
                    {/* Chat Section */}
                    <div ref={chatContainerRef} className='flex-1 px-[1%] overflow-y-auto scroll-auto mt-4 mb-16'>
        <div className="my-10 flex flex-col gap-5">
        {messages.map((msg, index) => {
    // Split the message text into lines
    const lines = msg.text.split('\n');

    // State to keep track of list items
    let listItems = [];
    let isOrderedList = false;
    let isInsideList = false;

    return (
        <div
            key={index}
            className={`flex items-start gap-2 sm:gap-5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
        >
            <img
                src={msg.sender === "user" ? assets.user_icon : assets.bbq_icon}
                alt={msg.sender}
                className="w-8 sm:w-10 rounded-full"
            />
            <div
                className={`${
                    msg.sender === "user"
                        ? "bg-[#000000] text-white font-verdana text-base sm:text-xl p-2 sm:p-4 rounded-lg shadow-md"
                        : "bg-[#1f628c] text-white font-verdana text-base sm:text-xl p-2 sm:p-4 rounded-lg shadow-md"
                } max-w-[85%] sm:max-w-[70%] break-words whitespace-pre-wrap leading-relaxed`}
            >
                {lines.map((line, i) => {
                    // Handle bold text
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                    // Handle list items
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                        if (isOrderedList) {
                            // Close ordered list if we were inside it
                            isInsideList = false;
                            isOrderedList = false;
                        }
                        listItems.push(<li key={i} dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />);
                        isInsideList = true;
                    } else if (/^\d+\. /.test(line)) {
                        if (!isOrderedList) {
                            // Close unordered list if we were inside it
                            if (listItems.length > 0) {
                                const ulList = (
                                    <ul className="list-disc ml-5 mb-2">{listItems}</ul>
                                );
                                listItems = []; // Reset listItems after rendering
                                return ulList;
                            }
                            isOrderedList = true;
                        }
                        listItems.push(<li key={i} dangerouslySetInnerHTML={{ __html: formattedLine.substring(line.indexOf(' ') + 1) }} />);
                        isInsideList = true;
                    } else {
                        if (isInsideList) {
                            // Close current list if we were inside one
                            isInsideList = false;
                            const listToRender = isOrderedList
                                ? <ol className="list-decimal ml-5 mb-2">{listItems}</ol>
                                : <ul className="list-disc ml-5 mb-2">{listItems}</ul>;
                            listItems = []; // Clear list items after rendering the list
                            return listToRender;
                        }
                        return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                    }
                })}
                {isInsideList && (
                    isOrderedList
                        ? <ol className="list-decimal ml-5 mb-2">{listItems}</ol>
                        : <ul className="list-disc ml-5 mb-2">{listItems}</ul>
                )}
            </div>
        </div>
    );
})}

                            {typingMessage && (
                                <div className="flex items-start gap-5 justify-start">
                                    <img src={assets.bbq_icon} alt="AI" className="w-10 rounded-full" />
                                    <p className="bg-[#1f628c] text-white font-verdana text-xl p-4 rounded-lg shadow-md max-w-[70%] break-words">
                                        {typingMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                        {isSending ? (
                            <div className='w-full flex flex-col gap-2.5'></div>
                        ) : (
                            <div>
                                {/* Suggestions Section */}
                                {!isSending && showSuggestions && (
                <div className="mt-6 flex gap-4 flex-wrap">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className="bg-[#00796b] text-white font-verdana text-l px-4 py-2 rounded-full shadow-md hover:bg-[#000000] transition-colors duration-300 text-sm md:text-base lg:text-lg"
                            onClick={() => sendMessage(suggestion)}
                        >
                            {suggestion}
                        </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 py-2 flex items-center justify-between gap-4 bg-white border-2 border-black shadow-lg rounded-lg sm:rounded-xl">
        <img
            src={assets.mic_icon}
            alt="Mic"
            className={`w-6 sm:w-7 cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
                if (!isSending) {
                    playMicSound(); 
                    startVoiceInput(); 
                }
            }}
            disabled={isSending}
        />
        <div className="flex items-center gap-2">
    {/* Translate Icon */}
    <span
        className={`material-symbols-outlined w-6 sm:w-7 cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleLanguageIconClick} // Functionality for the translate icon
        disabled={isSending}
    >
        translate
    </span>

    {/* File Upload Icon */}
    <span
        className={`material-symbols-outlined w-6 sm:w-7 cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={(handleFileIconClick) => document.getElementById('fileUpload').click()} // Triggers the file input click
        disabled={isSending}
    >
        quick_reference_all
    </span>

    {/* Hidden File Input */}
    <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="fileUpload"
        disabled={isSending}
    />
    </div>

        
                    {/* Input Field */}
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder={isSending ? 'Generating response...' : 'Enter your query here'}
                        onKeyDown={handleKeyDown}
                        className={`flex-1 bg-transparent border-none font-verdana outline-none p-2 text-sm sm:text-base md:text-lg lg:text-xl text-[#000000] break-words ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSending} // Disable input when sending
                    />
        
                    <div className="flex items-center gap-3.5">
                        {/* Send Icon */}
                        <img
                            onClick={() => input && sendMessage(input)}
                            src={assets.send_icon}
                            alt="Send"
                            className={`w-5 sm:w-6 cursor-pointer font-bold ${!input || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!input || isSending} // Disable button when no input or when sending
                        />
        
                        {/* Loader when sending */}
                        {isSending && (
                            <div className="relative flex items-center justify-center w-4 h-4 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 overflow-hidden sm:rounded-full">
    <img
      src={assets.bbq_icon}
      alt="BBQ Logo"
      className="w-full h-full object-cover animate-spin"
    />
  </div>
)}
                    </div>
                    </div>
                </div>
            </div>
            </div>
        );
    };
    export default Main;    