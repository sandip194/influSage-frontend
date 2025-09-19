import { useState, useRef } from "react";
import {
  RiSendPlane2Fill,
  RiFileTextLine,
  RiEmotionHappyLine,
  RiCloseLine,
} from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

export default function ChatInputVendor({ onSend }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() || file) {
      onSend({ text, file });
      setText("");
      setFile(null);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false); // close picker after selecting emoji
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const removeFile = () => setFile(null);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white flex flex-col space-y-2 border-t border-gray-200 relative"
    >
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-10 bg-white shadow-lg rounded-lg">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            height={370}
            width={300}
          />
        </div>
      )}

      {/* Selected File Display */}
      {file && (
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full max-w-xs">
          <RiFileTextLine />
          <span className="truncate">{file.name}</span>
          <button type="button" onClick={removeFile}>
            <RiCloseLine />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-xl text-gray-500"
        >
          <RiEmotionHappyLine size={25}/>
        </button>

        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-xl text-gray-500"
        >
          <RiFileTextLine size={25} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 border border-black rounded-full px-6 py-3 outline-none text-sm"
          placeholder="Write your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      <button
          type="submit"
          className="bg-[#0D132D] hover:bg-indigo-700 text-white p-3 rounded-full shadow-md transition"
        >
          <RiSendPlane2Fill />
        </button>
      </div>
    </form>
  );
}
