"use client";

import React, { useEffect, useState } from "react";
import ChatContent, { Message } from "./ChatContent";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import SuggestionsComponent from "./SuggestionsComponent";
import { removeHtmlTags, replaceBreakTags } from "../common/stringParser";

const ChatIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
    >
        <path
            fillRule="evenodd"
            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
            clipRule="evenodd"
        />
    </svg>
);

const RefreshIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
    >
        <path
            fillRule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
            clipRule="evenodd"
        />
    </svg>
);

const CloseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 ml-2"
    >
        <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
        />
    </svg>
);

const SendIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
    >
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const DownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-12 h-12"
    >
        <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
            clipRule="evenodd"
        />
    </svg>
);

const DUMMY_CHAT: Message[] = [
    {
        id: "m1",
        text: "👋 Hi! I am ChatbaseAI, ask me anything about Chatbase!",
        sender: "bot",
    },
    {
        id: "m2",
        text: "By the way, you can create a chatbot like me for your website! 😮",
        sender: "bot",
    },
    {
        id: "m3",
        text: "Chatbase is an AI chatbot builder that allows you to create and train chatbots using your own data. You can upload documents or add a link to your website, and Chatbase will generate a chatbot that can answer questions about the content. It's a powerful tool for building interactive chatbots for customer support, lead generation, content discovery, e-commerce assistance, and more. Let me know if you have any other questions!",
        sender: "bot",
    },
];

const DUMMY_SUGGESTIONS = [
    {
        id: "s1",
        text: "Hello there!!",
    },
    {
        id: "s2",
        text: "How are you",
    },
    {
        id: "s3",
        text: "How can I train my chatbot?",
    },
];

const saveChatToLocalStorage = (chat: Message[]) => {
    const chatObj = {
        chat: chat,
        expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };
    localStorage.setItem("chat", JSON.stringify(chatObj));
};

const getChatFromLocalStorage = () => {
    const entry = localStorage.getItem("chat");
    if (!entry) return null;

    const chatObj = JSON.parse(entry);
    if (chatObj.expiresIn < Date.now()) {
        localStorage.removeItem("chat");
        return null;
    }
    return chatObj.chat;
};

export default function ChatComponent() {
    const [chat, setChat] = useState<Message[]>([DUMMY_CHAT[0], DUMMY_CHAT[1]]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [loadingBotResponse, setLoadingBotResponse] = useState(false);

    const pushChat = (text: string, sender: string) => {
        const formattedString = removeHtmlTags(replaceBreakTags(text));
        setChat((prev) => {
            const newChat = [
                ...prev,
                { text: formattedString, sender, id: `m${prev.length + 1}` },
            ];
            saveChatToLocalStorage(newChat);
            return newChat;
        });
    };

    const handleSendMessage = () => {
        if (message === "") return;
        if (loadingBotResponse) return;

        pushChat(message, "user");
        setMessage("");
        generateReply();
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        console.log(e.target.cols);
        // console.log(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const generateReply = async () => {
        console.log("generateReply");
        setLoadingBotResponse(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoadingBotResponse(false);
        pushChat(DUMMY_CHAT[2].text, "bot");
    };

    useEffect(() => {
        const chat = getChatFromLocalStorage();
        if (chat) setChat(chat);
    }, []);

    return (
        <div className="flex fixed bottom-8 right-8 flex-col items-end ">
            {isChatOpen && (
                <div className="flex flex-col h-[600px] rounded-lg shadow-lg space border my-4 w-96 ">
                    <div className="p-4 flex items-center">
                        <ChatIcon />
                        <h6 className="ml-2 font-bold flex-1">Chat</h6>
                        <button
                            onClick={() => {
                                setChat([DUMMY_CHAT[0], DUMMY_CHAT[1]]);
                                saveChatToLocalStorage([
                                    DUMMY_CHAT[0],
                                    DUMMY_CHAT[1],
                                ]);
                            }}
                        >
                            <RefreshIcon />
                        </button>
                        <button onClick={() => setIsChatOpen(false)}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="mx-2 border-t flex-1 overflow-scroll flex flex-col-reverse no-scrollbar">
                        <ChatContent chat={chat} loading={loadingBotResponse} />
                    </div>
                    <div className="p-2 flex overflow-scroll">
                        <SuggestionsComponent
                            suggestions={DUMMY_SUGGESTIONS}
                            onClick={(suggestion) => {
                                pushChat(suggestion.text, "user");
                                generateReply();
                            }}
                        />
                    </div>
                    <div className="border-t flex items-end py-3 px-4">
                        <div className="flex w-full items-center leading-none">
                            <textarea
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                value={message}
                                required
                                placeholder="Message..."
                                rows={message.split("\n").length}
                                maxLength={4000}
                                tabIndex={0}
                                className="mr-3 max-h-36 w-full resize-none bg-transparent pr-3 leading-[24px] focus:outline-none focus:ring-0  focus-visible:ring-0"
                            />
                        </div>
                        <button
                            disabled={loadingBotResponse}
                            onClick={handleSendMessage}
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
            <button
                title="Contact Sale"
                onClick={() => setIsChatOpen((prev) => !prev)}
                className="bg-black rounded-full p-4 text-white shadow-lg w-12 h-12 flex items-center justify-center font-bold text hover:scale-110 transition duration-300 ease-in-out"
            >
                {isChatOpen ? <DownIcon /> : "C"}
            </button>
        </div>
    );
}
