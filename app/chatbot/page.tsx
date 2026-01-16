'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

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
                                    : message.role === 'assistant' ? `bg-gray-200 dark:bg-gray-700 mr-auto ${message.parts?.some(p => p.type === 'text') ? 'max-w-xs' : ''}` : ''
                            }`}>
                                <div className="text-sm font-medium mb-1">
                                    {message.role === 'user' ? 'You' : 'Assistant'}
                                </div>
                                <div>
                                    {message.parts?.map((part, partIndex) => (
                                        part.type === 'text' ? (
                                            <span key={partIndex}>{part.text}</span>
                                        ) : part.type === 'dynamic-tool' ? (
                                            part.toolName === 'search_users' ? (
                                                <div key={partIndex}>
                                                    <span>search_users</span>
                                                    <pre className="bg-gray-300 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                                                        {JSON.stringify(part.output || part.input || 'Tool executing...', null, 2)}
                                                    </pre>
                                                </div>
                                            ) : part.toolName === 'search_repositories' ? (
                                                <div key={partIndex}>
                                                    <span>search_repositories</span>
                                                    <pre className="bg-gray-300 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                                                        {JSON.stringify(part.output || part.input || 'Tool executing...', null, 2)}
                                                    </pre>
                                                </div>
                                            ) : part.toolName === 'search_code' ? (
                                                <div key={partIndex}>
                                                    <span>search_code</span>
                                                    <pre className="bg-gray-300 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                                                        {JSON.stringify(part.output || part.input || 'Tool executing...', null, 2)}
                                                    </pre>
                                                </div>
                                            ) : null
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

