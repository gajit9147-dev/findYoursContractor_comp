import React, { useState } from 'react';
import { MessageSquare, Send, Search, Paperclip } from 'lucide-react';

const Messages = () => {
    const [selectedConversation, setSelectedConversation] = useState(0);
    const [messageInput, setMessageInput] = useState('');

    const conversations = [
        {
            id: 1,
            name: 'BuildTech Solutions',
            lastMessage: 'Looking forward to working with you',
            time: '10 min ago',
            unread: 2,
            contract: 'Steel Frame Fabrication',
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            lastMessage: 'My certifications are up to date',
            time: '1 hour ago',
            unread: 0,
            contract: 'SS Piping Installation',
        },
        {
            id: 3,
            name: 'Metro Fabricators',
            lastMessage: 'Can you start next week?',
            time: '2 hours ago',
            unread: 1,
            contract: 'Welding Project',
        },
    ];

    const messages = [
        { sender: 'them', text: 'Hi, I saw your application for the Steel Frame project', time: '10:30 AM' },
        { sender: 'me', text: 'Hello! Yes, I\'m very interested in this project.', time: '10:32 AM' },
        { sender: 'them', text: 'Great! Can you share your portfolio?', time: '10:35 AM' },
        { sender: 'me', text: 'Sure! I\'ll send the documents right away.', time: '10:36 AM' },
        { sender: 'them', text: 'Looking forward to working with you', time: '10:40 AM' },
    ];

    const handleSend = () => {
        if (messageInput.trim()) {
            // Send message logic here
            setMessageInput('');
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto h-full flex">
                {/* Conversations List */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv, index) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(index)}
                                className={`p-4 border-b border-gray-200 cursor-pointer transition-all ${selectedConversation === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {conv.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                                            <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-blue-600 mb-1">{conv.contract}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                            {conv.unread > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                                    {conv.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Thread */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Thread Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {conversations[selectedConversation].name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">{conversations[selectedConversation].name}</h2>
                                <p className="text-sm text-gray-600">{conversations[selectedConversation].contract}</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'me'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSend}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
