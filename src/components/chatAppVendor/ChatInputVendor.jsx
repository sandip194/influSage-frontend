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

  if (!selectedFile) {
    setPreviewUrl(null);
    return;
  }

  const fileType = selectedFile.type;

  if (fileType.startsWith("image/")) {
    setPreviewUrl({ type: "image", url: URL.createObjectURL(selectedFile) });
  } else if (fileType === "application/pdf") {
    setPreviewUrl({ type: "pdf", url: URL.createObjectURL(selectedFile) });
  } else if (fileType.startsWith("video/")) {
    setPreviewUrl({ type: "video", url: URL.createObjectURL(selectedFile) });
  } else {
    setPreviewUrl({ type: "file", name: selectedFile.name });
  }
};

  const removeFile = () => {
  if (previewUrl?.url) {
    URL.revokeObjectURL(previewUrl.url);
  }
  setFile(null);
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
         <div className="w-full sm:w-80 md:w-96 lg:w-[350px] p-2">
            <span className="font-semibold">Replying to: </span>
            {replyTo.content || "Attachment"}
          </div>
          <button onClick={onCancelReply} className="text-gray-500 hover:text-red-500 ml-4">
            <RiCloseLine />
          </button>
        </div>
      )}

      {/* File/Image Preview */}
      {file && previewUrl && (
          <div className="relative w-fit max-w-xs">
            {previewUrl.type === "image" && (
              <img
                src={previewUrl.url}
                alt="preview"
                className="h-28 w-auto rounded-lg shadow cursor-pointer"
                onClick={() => window.open(previewUrl.url, "_blank")}
              />
            )}

            {previewUrl.type === "pdf" && (
              <iframe
                src={previewUrl.url}
                title="PDF Preview"
                className="w-40 h-28 rounded border"
              ></iframe>
            )}

            {previewUrl.type === "video" && (
              <video
                src={previewUrl.url}
                controls
                className="w-40 h-28 rounded shadow"
              />
            )}

            {previewUrl.type === "file" && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow">
                <RiFileTextLine />
                <span className="truncate max-w-[120px] text-sm">{previewUrl.name}</span>
              </div>
            )}

            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
            >
              <RiCloseLine />
            </button>
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