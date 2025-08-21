import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatAppPage() {
  const [activeChat, setActiveChat] = useState(null);

  // Messages state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'other',
      content: 'Hi How Are You?',
      type: 'text',
    },
    {
      id: 2,
      sender: 'you',
      content: "Nice to meet you. Let's talk about the project",
      type: 'text',
    },
  ]);

  // Send new message
  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'you',
      content: text,
      type: 'text',
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="h-[85vh] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
          activeChat ? 'hidden md:block' : 'block'
        }`}
      >
        <Sidebar onSelectChat={(chat) => setActiveChat(chat)} />
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 h-full flex flex-col ${
          activeChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
          <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          <ChatMessages chat={activeChat} messages={messages} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
