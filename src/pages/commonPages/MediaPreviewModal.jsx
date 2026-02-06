import React from "react";

const MediaPreviewModal = ({
  open,
  onClose,
  src,
  type = "image", // image | video | doc
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300"
        onClick={onClose}
      >
        &times;
      </button>

      {/* IMAGE */}
      {type === "image" && (
        <img
          src={src}
          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
          className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* VIDEO */}
      {type === "video" && (
        <video
          controls
          autoPlay
          className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
          onClick={(e) => e.stopPropagation()}
        >
          <source src={src} />
        </video>
      )}

      {/* DOC / PDF */}
      {type === "doc" && (
        <iframe
          src={`https://docs.google.com/viewer?url=${src}&embedded=true`}
          className="w-[90vw] h-[90vh] rounded-xl bg-white"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default MediaPreviewModal;
