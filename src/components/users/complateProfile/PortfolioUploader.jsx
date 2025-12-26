import React, { useState, useEffect } from "react";
import { Form, Input, Select, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
const { Dragger } = Upload;
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import useFileUpload from "../../../hooks/useFileUpload";
import FilePreview from "../../common/FilePreview";

const { Option } = Select;

const PortfolioUploader = ({ onBack, onNext, data, showControls, showToast, onSave }) => {
  const [form] = Form.useForm();
  const { token, userId } = useSelector(state => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [portfolioError, setPortfolioError] = useState("");
  const [languageError, setLanguageError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);


  // Custom hook for file handling
  const {
    fileList,
    existingFiles,
    deletedFilePaths,
    fileError,
    setExistingFiles,
    handleFileChange,
    handleRemove
  } = useFileUpload();

  // Fetch languages
  useEffect(() => {
    let mounted = true;
    const fetchLanguages = async () => {
      try {
        setLoadingLanguages(true);
        const res = await axios.get("languages", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted) setLanguages(res.data.languages || []);
      } catch (err) {
        console.error("Error fetching languages:", err);
      } finally {
        if (mounted) setLoadingLanguages(false);
      }
    };
    fetchLanguages();
    return () => { mounted = false; };
  }, [token]);

  // Initialize from props `data`
  useEffect(() => {
    if (!data) return;
    if (data.portfoliourl) setPortfolioUrl(data.portfoliourl);

    if (Array.isArray(data.filepaths)) {
      const filesFromBackend = data.filepaths
        .filter(f => f.filepath)
        .map((f, index) => ({
          uid: `existing-${index}`,
          name: f.filepath.split("/").pop(),
          url: f.filepath,
          type: f.filepath.split(".").pop()
        }));
      setExistingFiles(filesFromBackend);
    }

    const langs = data.languages ?? data.contentlanguages ?? [];
    if (Array.isArray(langs)) {
      const selectedIds = langs
        .map(l => l.languageid)
        .filter(id => languages.some(lang => lang.id === id));
      setSelectedLanguages(selectedIds);
    }
  }, [data, languages, setExistingFiles]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setHasSubmitted(true);
    setIsSubmitting(true);

    // reset errors
    setPortfolioError("");
    setLanguageError("");

    const hasFiles = fileList.length > 0 || existingFiles.length > 0;
    const url = portfolioUrl.trim();
    const isValidUrl = /^https?:\/\/.+/.test(url);

    let hasError = false;

    // Portfolio validation
    if (!hasFiles && !isValidUrl) {
      setPortfolioError(
        "Please upload at least one portfolio file or provide a valid portfolio URL."
      );
      hasError = true;
    }

    // Language validation
    if (selectedLanguages.length === 0) {
      setLanguageError("Please select at least one language.");
      hasError = true;
    }

    // ⛔ Stop submission ONLY AFTER checking everything
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {


      for (const filepath of deletedFilePaths) {
        await axios.post(
          "/user/profile/delete-portfolio-file",
          { userId, filepath },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const formData = new FormData();

      const existingFilePaths = existingFiles.map(f => ({
        filepath: f.url.startsWith("http")
          ? f.url.replace(`${BASE_URL}/`, "")
          : f.url
      }));

      const selectedLanguagesData = selectedLanguages
        .map(langId => {
          const lang = languages.find(l => l.id === langId);
          return lang ? { languageid: lang.id, languagename: lang.name } : null;
        })
        .filter(Boolean);

      formData.append(
        "portfoliojson",
        JSON.stringify({
          portfoliourl: isValidUrl ? url : null,
          filepaths: existingFilePaths.length
            ? existingFilePaths
            : [{ filepath: null }],
          languages: selectedLanguagesData,
        })
      );

      fileList.forEach(f => formData.append("portfolioFiles", f));

      const res = await axios.post("user/complete-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const successMessage =
          res?.data?.message || "Profile updated successfully";

        if (showToast) toast.success(successMessage);

        setIsFormChanged(false);

        onSave?.(formData);
        onNext?.();
      } else {
        message.error("Something went wrong while saving.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      message.error("Failed to submit portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-white p-2 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Upload your portfolio or recent works
      </p>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* File Uploader */}
        <Form.Item className="mb-6">
          <Dragger
            name="file"
            multiple
            fileList={[]}
            beforeUpload={() => false}
            onChange={(info) => {
              handleFileChange(info);
              setIsFormChanged(true);
              setPortfolioError("");
              info.fileList.length = 0;
            }}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">
                Max 5 files, each under 25MB. PNG, JPG, MP4, MOV, PDF, DOC, DOCX
              </p>
            </div>
          </Dragger>
          {fileError && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {fileError}
            </p>
          )}

          {hasSubmitted && portfolioError && !fileError && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {portfolioError}
            </p>
          )}

        </Form.Item>

        {/* File Previews */}
        <FilePreview
          files={[
            ...existingFiles,
            ...fileList.filter(
              (file) =>
                !existingFiles.some(
                  (existing) =>
                    existing.name === file.name || existing.url === file.url
                )
            ),
          ]}
          onRemove={(file) => {
            handleRemove(file.uid);
            setIsFormChanged(true);
          }}
        />

        {/* Portfolio URL */}
        <Form.Item
          label={<span className="font-semibold text-sm text-gray-800">Portfolio URL</span>}
          validateStatus={portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl) ? "warning" : ""}
          help={
            portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl)
              ? "Enter a valid URL (https://...)"
              : ""
          }
        >
          <Input
            placeholder="https://"
            size="large"
            value={portfolioUrl}
            onChange={(e) => {
              const value = e.target.value;
              setPortfolioUrl(value);
              setIsFormChanged(true);
              if (/^https?:\/\/.+/.test(value)) {
                setPortfolioError("");
              }
            }}
            className="rounded-lg"
          />
        </Form.Item>

        {/* Languages */}
        <Form.Item className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Languages <span className="text-red-500">*</span>
          </label>
          <Select
            mode="multiple"
            size="large"
            style={{ width: "100%" }}
            placeholder={loadingLanguages ? "Loading languages..." : "Select Languages"}
            value={selectedLanguages}
            onChange={(values) => {
              setSelectedLanguages(values);
              setLanguageError("");
              setIsFormChanged(true);
            }}
            loading={loadingLanguages}
          >
            {languages.map(({ id, name }) => (
              <Option key={id} value={id}>{name}</Option>
            ))}
          </Select>
          {hasSubmitted && languageError && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {languageError}
            </p>
          )}


        </Form.Item>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 mt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
            >
              Back
            </button>
          )}
          {(showControls || onNext) && (
            <button
              type="submit"
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`px-8 py-3 rounded-full text-white font-medium transition
                ${(onNext || isFormChanged) && !isSubmitting
                  ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default PortfolioUploader;
