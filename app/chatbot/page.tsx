'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import SearchUsers from './components/search_users.component';
import SearchRepositories from './components/search_repositories.compoenent';

export default function ChatBot() {
    const { messages, sendMessage, error } = useChat();
    const [input, setInput] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setErrorMessage(null); // Clear any previous errors
            setIsLoading(true);
            sendMessage({ text: input });
            setInput('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        console.log("Messages updated:", messages);
        setIsLoading(false);
    }, [messages]);

    useEffect(() => {
        if (error) {
            console.error("Chat API Error:", error);
            setErrorMessage(`Error: ${error.message || 'Something went wrong with the AI model'}`);
        }
    }, [error]);

    const parseJSONString = (part: any) => {
        try {
            const jsonString = (part.output as unknown as any)?.content[0].text;
            if (typeof jsonString === 'string' && (jsonString.trim().startsWith('{') || jsonString.trim().startsWith('['))) {
                return JSON.parse(jsonString);
            }
            return {};
        } catch (error) {
            // console.error('Failed to parse JSON:', error);
            return {};
        }
    };

    return (
            <>
                <title>Kobi Krasnoff - Personal ChatBot</title>
                <h1 className="mx-auto max-w-innerFrame font-bold text-5xl pl-4 mt-4">Personal ChatBot</h1>
                {errorMessage && (
                    <div className="mx-auto max-w-innerFrame mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span>{errorMessage}</span>
                            <button 
                                onClick={() => setErrorMessage(null)}
                                className="ml-4 text-red-500 hover:text-red-700 font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
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
                                                    <SearchUsers data={(() => parseJSONString(part))()} />
                                                </div>
                                            ) : part.toolName === 'search_repositories' ? (
                                                <div key={partIndex}>
                                                    <SearchRepositories data={(() => parseJSONString(part))()} />
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
                            disabled={isLoading}
                        />
                        {isLoading && (
                            <div className="mt-2 text-center text-gray-500">
                                AI is thinking...
                            </div>
                        )}
                    </form>
                </div>
            </>
        );
}

