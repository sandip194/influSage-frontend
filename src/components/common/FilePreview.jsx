import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { PhotoProvider, PhotoView } from "react-photo-view";

const FilePreview = ({ files = [], onRemove }) => {
  // helper to detect type from extension or MIME
  const getFileType = (file) => {
    if (!file) return "";
    // If file.type exists and looks like MIME, use it
    if (file.type && file.type.includes("/")) {
      if (file.type.startsWith("image")) return "image";
      if (file.type.startsWith("video")) return "video";
      if (file.type.includes("pdf")) return "pdf";
      if (
        file.type.includes("word") ||
        file.type.includes("officedocument")
      )
        return "doc";
      return "other";
    }
    // Otherwise, try from extension
    const ext = (file.name || file.filepath || "")
      .split(".")
      .pop()
      .toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
    if (["mp4", "mov", "webm"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";
    return "other";
  };

  return (
    <PhotoProvider>
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        {files.map((file) => {
          const type = getFileType(file);
          const displayUrl = file.url || file.previewUrl || file.filepath;

          return (
            <div
              key={file.uid || file.filepath}
              className="relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
            >
              {type === "image" ? (
                <PhotoView src={displayUrl}>
                  <img
                    src={displayUrl}
                    alt="preview"
                    className="object-cover w-full h-full cursor-pointer"
                  />
                </PhotoView>
              ) : type === "video" ? (
                <video
                  src={displayUrl}
                  controls
                  muted
                  className="object-cover w-full h-full"
                />
              ) : (
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex flex-col items-center text-xs ${
                    type === "pdf"
                      ? "text-red-600"
                      : type === "doc"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {type === "pdf"
                    ? "📄 PDF File"
                    : type === "doc"
                    ? "📝 Word File"
                    : "📁 View File"}
                </a>
              )}

              {onRemove && (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded-full"
                  onClick={() => onRemove(file)}
                >
                  <DeleteOutlined />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </PhotoProvider>
  );
};

export default FilePreview;
