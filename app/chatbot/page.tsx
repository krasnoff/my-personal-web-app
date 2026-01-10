'use client';

import { useState } from "react";
import { useChat } from '@ai-sdk/react';

export default function ChatBot() {
    const { messages, sendMessage } = useChat();
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };
    
    return (
            <>
                <title>Kobi Krasnoff - Personal ChatBot</title>
                <h1 className="mx-auto max-w-innerFrame font-bold text-5xl pl-4 mt-4">Personal ChatBot</h1>
                <div className="mx-auto max-w-innerFrame flex mt-4 flex-col" style={{ height: 'calc(100vh - 410px)' }}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(message => (
                            <div key={message.id} className={`p-3 rounded-lg ${
                                message.role === 'user' 
                                    ? 'bg-blue-500 text-white ml-auto max-w-xs'
                                    : 'bg-gray-200 dark:bg-gray-700 mr-auto max-w-xs'
                            }`}>
                                <div className="text-sm font-medium mb-1">
                                    {message.role === 'user' ? 'You' : 'Assistant'}
                                </div>
                                <div>
                                    {message.parts?.map((part, partIndex) => (
                                        part.type === 'text' ? (
                                            <span key={partIndex}>{part.text}</span>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="p-4">
                        <input
                            className="w-full p-3 border border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={input}
                            placeholder="Ask me anything..."
                            onChange={handleInputChange}
                        />
                    </form>
                </div>
            </>
        );
}

