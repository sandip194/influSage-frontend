import { useState, useCallback, useRef, useEffect } from "react";
import { message } from "antd";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 25;

function extractFileName(input) {
  if (!input) return "";
  try {
    const decoded = decodeURIComponent(input);
    return decoded.split("/").pop();
  } catch {
    return input.split("/").pop();
  }
}

export default function useFileUpload() {
  const [fileList, setFileList] = useState([]); // new uploads
  const [existingFiles, setExistingFiles] = useState([]); // from API
  const [deletedFilePaths, setDeletedFilePaths] = useState([]);
  const [fileError, setFileError] = useState("");

  const uploadedUIDsRef = useRef(new Set());

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      fileList.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
  }, [fileList]);

  const getFileUID = useCallback((file) => {
    const lm = file.lastModified || Date.now();
    return `${file.name}-${file.size}-${lm}`;
  }, []);

  const existingFileNames = useCallback(() => {
    return existingFiles.map((f) => extractFileName(f.url || f.filepath)).map(n => n.toLowerCase());
  }, [existingFiles]);

  const handleFileChange = useCallback(
    (info) => {
      const rawFiles = (info.fileList || []).map((f) => f.originFileObj || f).filter(Boolean);
      const newValidFiles = [];
      const newErrors = [];

      const existingNames = existingFileNames();
      const currentNames = [...fileList.map((f) => f.name.toLowerCase()), ...existingNames];

      for (const file of rawFiles) {
        const uid = getFileUID(file);
        const fileName = file.name.toLowerCase();

        if (uploadedUIDsRef.current.has(uid)) continue;

        if (!ALLOWED_TYPES.includes(file.type)) {
          newErrors.push(`${file.name} isn’t a supported file type. Please upload PNG, JPG, MP4, MOV, PDF, DOC, or DOCX.`);
          continue;
        }

        const sizeMb = file.size / 1024 / 1024;
        if (sizeMb > MAX_SIZE_MB) {
          newErrors.push(`${file.name} is too large. The maximum size allowed is ${MAX_SIZE_MB} MB.`);
          continue;
        }

        if (currentNames.includes(fileName)) {
          newErrors.push(`${file.name} has already been uploaded. Please select a different file.`);
          continue;
        }

        file.uid = uid;
        file.previewUrl = URL.createObjectURL(file);
        uploadedUIDsRef.current.add(uid);
        newValidFiles.push(file);
      }

      const totalCount = existingFiles.length + fileList.length + newValidFiles.length;
      if (totalCount > MAX_FILES) {
        const allowedToAdd = MAX_FILES - (existingFiles.length + fileList.length);
        if (allowedToAdd <= 0) {
          newErrors.push(`You’ve reached the upload limit. You can upload up to ${MAX_FILES} files total.`);
          newValidFiles.length = 0;
        } else {
          newErrors.push(`You can only add ${allowedToAdd} more file${allowedToAdd > 1 ? "s" : ""}.`);
          newValidFiles.length = allowedToAdd;
        }
      }

      if (newErrors.length > 0) {
        const combinedMessage = newErrors.join("\n");
        setFileError(combinedMessage);
        message.warning(combinedMessage);
      } else {
        setFileError("");
      }

      if (newValidFiles.length > 0) setFileList((prev) => [...prev, ...newValidFiles]);
    },
    [existingFiles, fileList, existingFileNames, getFileUID]
  );

  const handleRemove = useCallback(
    (uid) => {
      setFileError("");
      uploadedUIDsRef.current.delete(uid);

      if (uid.startsWith("existing-")) {
        const fileToRemove = existingFiles.find((f) => f.uid === uid);
        if (!fileToRemove) return;
        const relativePath = fileToRemove.filepath || fileToRemove.url;
        setDeletedFilePaths((prev) => [...prev, relativePath]);
        setExistingFiles((prev) => prev.filter((f) => f.uid !== uid));
      } else {
        setFileList((prev) => prev.filter((f) => f.uid !== uid));
      }
    },
    [existingFiles]
  );

  // ===== RESET ALL FILES =====
  const resetFiles = useCallback(() => {
    // Clear all states
    setFileList([]);
    setExistingFiles([]);
    setDeletedFilePaths([]);
    setFileError("");
    uploadedUIDsRef.current.clear();
    message.destroy();
  }, []);

  return {
    fileList,
    existingFiles,
    deletedFilePaths,
    fileError,
    setFileList,        // expose setter for manual resets
    setExistingFiles,
    setDeletedFilePaths,
    handleFileChange,
    handleRemove,
    resetFiles,         // new function to reset everything
  };
}
