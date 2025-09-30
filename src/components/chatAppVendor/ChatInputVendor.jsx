import { useState, useRef } from "react";
import {
  RiSendPlane2Fill,
  RiFileTextLine,
  RiEmotionHappyLine,
  RiCloseLine,
} from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

export default function ChatInputVendor({ onSend, replyTo, onCancelReply }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() || file) {
      onSend({ text, file });
      setText("");
      setFile(null);
      setPreviewUrl(null);
      onCancelReply();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); 
    }
    setPreviewUrl(null);
  };

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

      {/* Reply UI */}
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-100 border-l-4 border-[0D132D] text-sm text-gray-700 px-4 py-2 rounded-md">
          <div className="truncate">
            <span className="font-semibold">Replying to: </span>
            {replyTo.content || "Attachment"}
          </div>
          <button onClick={onCancelReply} className="text-gray-500 hover:text-red-500 ml-4">
            <RiCloseLine />
          </button>
        </div>
      )}

      {/* File/Image Preview */}
      {file && (
        <div className="relative w-fit">
          {previewUrl ? (
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="preview"
                className="h-25 w-auto rounded-lg shadow"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
              >
                <RiCloseLine />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 max-w-xs">
              <RiFileTextLine />
              <span className="truncate">{file.name}</span>
              <button type="button" onClick={removeFile}>
                <RiCloseLine />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-xl text-gray-500"
        >
          <RiEmotionHappyLine size={25} />
        </button>

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
