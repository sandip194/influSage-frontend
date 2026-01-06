import { useState, useRef, useEffect } from "react";
import {
  RiSendPlane2Fill,
  RiFileTextLine,
  RiEmotionHappyLine,
  RiCloseLine,
} from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import useSocketRegister from "../../sockets/useSocketRegister";

export default function ChatInput({
  
  canstartchat = true, // 👈 new prop (default true)
  onSend,
  replyTo,
  onCancelReply,
  editingMessage,
  onEditComplete,
}) {
    useSocketRegister();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Block input actions when chat not allowed
  const toastBlockedRef = useRef(false);

  const handleBlockedAction = () => {
    if (!toastBlockedRef.current) {
      toast.warning("You cannot send messages for this campaign yet.");
      toastBlockedRef.current = true;
      setTimeout(() => (toastBlockedRef.current = false), 2000); // 2 sec throttle
    }
  };


  const handleSubmit = () => {
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
    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
        <div className="mb-2 px-3 py-2 rounded-lg border-l-4 border-[#0D132D] bg-gray-100 flex items-center gap-3">

          {/* LEFT → TEXT */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-gray-500 font-medium">
              Replying to
            </span>

            <span className="text-sm font-medium text-gray-800 truncate">
              {replyTo.ishtml
                ? "Campaign Invitation"
                : replyTo.content
                ? replyTo.content
                : replyTo.file
                ? "📎 Attachment"
                : "Message"}
            </span>
          </div>

          {/* RIGHT → IMAGE THUMBNAIL (if exists) */}
          {replyTo.file && /\.(jpg|jpeg|png|gif|webp)$/i.test(replyTo.file) && (
            <img
              src={replyTo.file}
              alt="reply preview"
              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
            />
          )}

          {/* CLOSE */}
          <button
            type="button"
            onClick={onCancelReply}
            className="text-gray-500 hover:text-gray-700 text-lg flex-shrink-0"
            aria-label="Cancel reply"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      {/* File Preview */}
      {file && previewUrl && (
        <div className="relative w-full max-w-xs">
          <button
            type="button"
            onClick={removeFile}
            className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-red-100 z-10"
            aria-label="Remove attachment"
          >
            <RiCloseLine size={14} />
          </button>
          {previewUrl.type === "image" && (
            <div className="relative inline-block">
              {/* Image */}
              <div
                className="w-20 aspect-square rounded-lg overflow-hidden shadow cursor-pointer"
                onClick={() => window.open(previewUrl.url, "_blank")}
              >
                <img
                  src={previewUrl.url}
                  alt="preview"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-red-100 z-10"
              >
                <RiCloseLine size={14} />
              </button>
            </div>
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

        <textarea
          className="flex-1 border border-gray-300 bg-gray-100 rounded-2xl
            px-4 sm:px-6 py-2 sm:py-3 outline-none text-sm w-full
            resize-none overflow-hidden"
          placeholder={canstartchat ? "Write your message" : "You can’t send messages right now"}
          disabled={!canstartchat}
          value={text}
          rows={1}
          style={{ maxHeight: "100px" }}
          enterKeyHint="enter"
          onClick={() => {
            if (!canstartchat) handleBlockedAction();
          }}
          onChange={(e) => {
            if (!canstartchat) {
              handleBlockedAction();
              return;
            }

            setText(e.target.value);

            e.target.style.height = "auto";
            const maxHeight = 100;

            if (e.target.scrollHeight > maxHeight) {
              e.target.style.height = `${maxHeight}px`;
              e.target.style.overflowY = "auto";
            } else {
              e.target.style.height = `${e.target.scrollHeight}px`;
              e.target.style.overflowY = "hidden";
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          disabled={!canstartchat}
          onClick={handleSubmit}
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
