import React from "react";

export type Message = {
    id: string;
    text: string;
    sender: string;
};

type ChatProps = {
    children: React.ReactNode;
};

export const BotChat: React.FC<ChatProps> = ({ children }) => {
    return (
        <div className="flex flex-row items-start justify-start">
            <div className="flex flex-col items-start justify-center p-4 font-light text-base max-w-xs mx-2 my-2 leading-5 text-black bg-stone-100 rounded-lg ">
                {children}
            </div>
        </div>
    );
};

const UserChat: React.FC<ChatProps> = ({ children }) => {
    return (
        <div className="flex flex-row items-start justify-end">
            <div className="flex flex-col items-start justify-center p-4 max-w-xs mx-2 my-2 text-base font-light leading-5  text-white bg-violet-500 rounded-lg shadow">
                {children}
            </div>
        </div>
    );
};

const ChatLoading = () => {
    return <BotChat>...</BotChat>;
};

type ChatContentProps = {
    chat: Message[];
    loading?: boolean;
};
const ChatContent: React.FC<ChatContentProps> = ({ chat, loading = false }) => {
    const components = chat.map((message) => {
        if (message.sender === "bot") {
            return <BotChat key={message.id}>{message.text}</BotChat>;
        } else {
            return <UserChat key={message.id}>{message.text}</UserChat>;
        }
    });

    return (
        <div className={`flex flex-col `}>
            {components}
            {loading && <ChatLoading />}
        </div>
    );
};

export default ChatContent;
