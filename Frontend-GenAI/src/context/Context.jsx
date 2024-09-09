import { createContext, useState } from "react";
import { sendPrompt } from "../api";
import PropTypes from 'prop-types';

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);  
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [themeColor, setThemeColor] = useState("#e9f1f7");
    
    // User Profile State
    const [userProfile, setUserProfile] = useState({
        group12: '',
        physicsMark: '',
        chemistryMark: '',
        mathsMark: '',
        biologyMark: '',
        jeeMainsMark: '',
        tenthPercentage: '',
        twelfthPercentage: '',
        exams: {
            bitsat: '',
            jeeAdvanced: '',
            met: ''
        },
        parentalIncome: '',
        category: ''
    });

    // State for Username
    const [username, setUsername] = useState("");
    const [useremail, setuseremail]=useState(""); // New state to store the username

    const updateUsername = (name) => {
        setUsername(name);
    };

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        if (recentPrompt || resultData) {
            setChatHistory(prevHistory => [
                ...prevHistory,
                { prompt: recentPrompt, response: resultData }
            ]); 
        }

        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setResultData("");
        setInput("");
        setThemeColor("#f4ece1");
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await sendPrompt(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await sendPrompt(input);
        }

        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        setChatHistory(prevHistory => [
            ...prevHistory,
            { prompt: recentPrompt, response: newResponse2 }
        ]);
        setLoading(false);
        setInput("");
    };

    const updateUserProfile = (updatedProfile) => {
        setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    };

    const getChatHistory = () => {
        return chatHistory;
    };

    const editChatHistory = (index, updatedChat) => {
        const updatedHistory = [...chatHistory];
        updatedHistory[index] = updatedChat;
        setChatHistory(updatedHistory);
    };

    // Context value object to be provided to all components that use this context
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        chatHistory,
        getChatHistory,
        editChatHistory,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        themeColor,
        userProfile,
        updateUserProfile,
        username,  
        updateUsername,
        useremail,
        setuseremail,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default ContextProvider;
