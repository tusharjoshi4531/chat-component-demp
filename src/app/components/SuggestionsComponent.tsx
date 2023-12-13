import React from "react";
import { BotChat } from "./ChatContent";

export type Suggestion = {
    id: string;
    text: string;
};

type SuggestionsComponentProps = {
    suggestions: Suggestion[];
    onClick: (suggestion: Suggestion) => void;
};
const SuggestionsComponent: React.FC<SuggestionsComponentProps> = ({
    suggestions,
    onClick,
}) => {
    const comp = suggestions.map((suggestion) => (
        <button
            key={suggestion.id}
            className="text-sm whitespace-nowrap text-black font-light bg-stone-100 rounded-lg p-2 m-1"
            onClick={() => onClick(suggestion)}
        >
            {suggestion.text}
        </button>
    ));
    return <div className="flex">{comp}</div>;
};

export default SuggestionsComponent;
