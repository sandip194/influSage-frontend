import { useState, useRef, useEffect } from "react";
import {
  RiSendPlane2Fill,
  RiFileTextLine,
  RiEmotionHappyLine,
  RiCloseLine,
} from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

export default function ChatInputVendor({
  canstartchat = true, // 👈 new prop (default true)
  onSend,
  replyTo,
  onCancelReply,
  editingMessage,
  onEditComplete,
}) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Block input actions when chat not allowed
  const toastBlockedRef = useRef(false);

  const handleBlockedAction = () => {
    if (!toastBlockedRef.current) {
      toast.warning("You cannot send messages for this campaign yet.");
      toastBlockedRef.current = true;
      setTimeout(() => (toastBlockedRef.current = false), 2000); // 2 sec throttle
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canstartchat) {
      handleBlockedAction();
      return;
    }

    if (!text.trim() && !file) return;

    if (editingMessage) {
      onEditComplete({
        ...editingMessage,
        content: text,
        file: file || editingMessage.file,
        replyId: replyTo?.id || null,
      });
    } else {
      onSend({
        text,
        file,
        replyId: replyTo?.id || null,
      });
    }

    setText("");
    setFile(null);
    setPreviewUrl(null);
    onCancelReply && onCancelReply();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  const handleEmojiClick = (emojiData) => {
    if (!canstartchat) {
      handleBlockedAction();
      return;
    }
    setText((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e) => {
    if (!canstartchat) { handleBlockedAction(); return; }

    const selectedFile = e.target.files[0];

    // Revoke old URL if exists
    if (previewUrl?.url) URL.revokeObjectURL(previewUrl.url);

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

    // Reset input to allow re-upload of same file
    fileInputRef.current.value = "";
  };


  const removeFile = () => {
    if (previewUrl?.url?.startsWith("blob:")) URL.revokeObjectURL(previewUrl.url);
    setFile(null);
    setPreviewUrl(null);
  };


  useEffect(() => {
    if (editingMessage?.file) {
      setPreviewUrl({
        type: "file",
        url: editingMessage.file,
        name: editingMessage.file.split("/").pop(),
      });
    }
    setText(editingMessage?.content || "");
  }, [editingMessage]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 bg-white flex flex-col space-y-2 border-t border-gray-100 relative ${!canstartchat ? "opacity-70 cursor-not-allowed" : ""
        }`}
    >
      {/* Emoji Picker */}
      {showEmojiPicker && canstartchat && (
        <div className="absolute bottom-20 left-4 z-10 bg-white shadow-lg rounded-lg">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            height={370}
            width={300}
          />
        </div>
      )}

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 border-l-4 border-[#0D132D] text-sm text-gray-700 px-4 py-2 rounded-md space-y-2 sm:space-y-0">
          <div className="flex-1 truncate">
            <span className="font-semibold">Replying to: </span>
            <span className="truncate">{replyTo.content || "Attachment"}</span>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-gray-500 hover:text-red-500 ml-0 sm:ml-4"
          >
            <RiCloseLine />
          </button>
        </div>
      )}

      {/* File Preview */}
      {file && previewUrl && (
        <div className="relative w-full max-w-xs">
          {previewUrl.type === "image" && (
            <img
              src={previewUrl.url}
              alt="preview"
              className="h-28 w-full object-cover rounded-lg shadow cursor-pointer"
              onClick={() => window.open(previewUrl.url, "_blank")}
            />
          )}
          {previewUrl.type === "pdf" && (
            <iframe
              src={previewUrl.url}
              title="PDF Preview"
              className="w-full h-28 rounded border"
            ></iframe>
          )}
          {previewUrl.type === "video" && (
            <video
              src={previewUrl.url}
              controls
              className="w-full h-28 rounded shadow"
            />
          )}
          {previewUrl.type === "file" && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow">
              <RiFileTextLine />
              <span className="truncate max-w-[120px] text-sm">
                {previewUrl.name}
              </span>
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

      {/* Input */}
      <div className="flex items-center space-x-2 w-full">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() =>
              canstartchat
                ? setShowEmojiPicker((prev) => !prev)
                : handleBlockedAction()
            }
            className="text-gray-500 hover:text-gray-700"
          >
            <RiEmotionHappyLine size={25} />
          </button>

          <button
            type="button"
            onClick={() =>
              canstartchat ? fileInputRef.current.click() : handleBlockedAction()
            }
            className="text-gray-500 hover:text-gray-700"
          >
            <RiFileTextLine size={25} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <input
          type="text"
          className="flex-1 border border-gray-300 bg-gray-100 rounded-full px-4 sm:px-6 py-2 sm:py-3 outline-none text-sm w-full"
          placeholder={canstartchat ? "Write your message" : "You can’t send messages right now"}
          disabled={!canstartchat}
          value={text}
          onClick={() => {
            if (!canstartchat) handleBlockedAction();
          }}
          onChange={(e) => {
            if (!canstartchat) {
              handleBlockedAction();
              return;
            }
            setText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          disabled={!canstartchat}
          className={`${canstartchat
            ? "bg-[#0D132D] hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
            } text-white p-3 rounded-full shadow-md transition flex-shrink-0`}
        >
          <RiSendPlane2Fill />
        </button>
      </div>
    </form>
  );
}
