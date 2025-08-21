import { useState } from 'react';
import { RiSendPlane2Fill } from 'react-icons/ri';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white flex items-center space-x-2 border-t border-gray-200"
    >
      <input
        type="text"
        className="flex-1 border border-gray-200 rounded-full px-6 py-3 outline-none text-sm"
        placeholder="Write your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="text-2xl text-indigo-600">
        <RiSendPlane2Fill />
      </button>
    </form>
  );
}
