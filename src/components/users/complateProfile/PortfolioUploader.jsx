import React, { useState, useEffect } from 'react';
import { Upload, Form, Input, message, Select, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
const { Dragger } = Upload;
const { Option } = Select;

const PortfolioUploader = ({ onBack, onNext, data }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [deletedFilePaths, setDeletedFilePaths] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);


  const { token, userId } = useSelector(state => state.auth);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/jpg',
    'video/mp4', 'video/quicktime',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Helper to generate UID based on file properties (unique)
  const getFileUID = (file) => `${file.name}-${file.size}-${file.lastModified}`;

  // Remove file by uid from either existing or new list
  const handleRemove = (uid) => {
    if (uid.startsWith("existing-")) {
      const fileToRemove = existingFiles.find(file => file.uid === uid);
      if (!fileToRemove) return;

      // Extract relative path
      const relativePath = fileToRemove.url.replace(`${BASE_URL}/`, '');

      // Save this path to be deleted later
      setDeletedFilePaths(prev => [...prev, relativePath]);

      // Remove from UI
      setExistingFiles(prev => prev.filter(file => file.uid !== uid));
    } else {
      setFileList(prev => prev.filter(file => file.uid !== uid));
    }

    setFileError('');
  };

useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoadingLanguages(true);
        const res = await axios.get("languages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLanguages(res.data.languages || []);
      } catch (err) {
        console.error("Error fetching languages:", err);
      } finally {
        setLoadingLanguages(false);
      }
    };
    fetchLanguages();
  }, [token]);

useEffect(() => {
  if (data?.languages?.length && languages.length) {
    const selectedIds = data.languages.map(l => l.languageid)
      .filter(id => languages.some(lang => lang.id === id));
    setSelectedLanguages(selectedIds);
  }
}, [data, languages]);

  // Form submission handler
  const handleSubmit = async () => {
    console.log("Submitting portfolio...");
    const hasFiles = fileList.length > 0 || existingFiles.length > 0;
    const isValidUrl = /^https?:\/\/.+/.test(portfolioUrl);

    if (!hasFiles && !isValidUrl) {
      setFileError('Please upload at least one file or add a valid portfolio URL.');
      message.error('Please upload at least one file or add a valid portfolio URL.');
      return;
    }
    // Require at least one language
      if (selectedLanguages.length === 0) {
        message.error("Please select at least one language");
        return;
      }
    // 🔴 1. First delete removed existing files from the server
    try {
      for (const filepath of deletedFilePaths) {
        await axios.post(`/user/profile/delete-portfolio-file`, {
          userId,
          filepath,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (deleteErr) {
      console.error("Delete failed", deleteErr);
      message.error("Failed to delete removed files.");
      return; // You may want to prevent form submission on delete failure
    }

    // 🔵 2. Continue with uploading remaining data
    const formData = new FormData();

    const existingFilePaths = existingFiles.map(file => ({
      filepath: file.url.startsWith('http')
        ? file.url.replace(`${BASE_URL}/`, '')
        : file.url,
    }));

    const selectedLanguagesData = selectedLanguages.map(langId => {
    const lang = languages.find(l => l.id === langId);
    return lang ? { languageid: lang.id, languagename: lang.name } : null;
  }).filter(Boolean);

    const portfoliojson = {
      portfoliourl: isValidUrl ? portfolioUrl : null,
      filepaths: existingFilePaths.length > 0 ? existingFilePaths : [{ filepath: null }],
      languages: selectedLanguagesData,
    };

    formData.append("portfoliojson", JSON.stringify(portfoliojson));
    fileList.forEach(file => {
      formData.append("portfolioFiles", file);
    });
console.log("portfoliojson object:", portfoliojson);
for (let [key, value] of formData.entries()) {
  console.log("FormData entry:", key, value);
}
    try {
      const res = await axios.post("user/complete-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      if (res.status === 200) {
        message.success("Portfolio submitted successfully!");
        console.log("Submitted data:", formData);
        onNext?.();
      } else {
        message.error("Something went wrong.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      message.error("Failed to submit portfolio.");
    }
  };


  // Initialize existing files and portfolio URL from data prop
  useEffect(() => {
    if (data) {
      if (data.portfoliourl) setPortfolioUrl(data.portfoliourl);

      if (Array.isArray(data.filepaths)) {
        const filesFromBackend = data.filepaths
          .filter(f => f.filepath)
          .map((f, index) => {
            const fullUrl = f.filepath.startsWith('http')
              ? f.filepath
              : `${BASE_URL}/${f.filepath.replace(/^\/+/, '')}`;

            const fileName = f.filepath.split('/').pop()?.toLowerCase() || '';
            const ext = fileName.split('.').pop();

            let type = '';
            if (['png', 'jpg', 'jpeg'].includes(ext)) {
              type = 'image';
            } else if (['mp4', 'mov'].includes(ext)) {
              type = 'video';
            } else if (ext === 'pdf') {
              type = 'pdf';
            } else if (['doc', 'docx'].includes(ext)) {
              type = 'doc';
            }

            return {
              uid: `existing-${index}`,
              name: fileName,
              url: fullUrl,
              status: 'done',
              type,
            };
          });


        setExistingFiles(filesFromBackend);
      }
      if (Array.isArray(data.contentlanguages)) {
      const selectedIds = data.contentlanguages.map(l => l.languageid);
      setSelectedLanguages(selectedIds);
    }
    }
  }, [data, languages]);

  // Handler for when user selects files in the uploader
  const handleFileChange = (info) => {
    const incomingFiles = info.fileList
      .map(f => f.originFileObj || f)
      .filter(Boolean);

    let errorMessages = [];

    setFileList(prevFiles => {
      const combinedFiles = [...prevFiles, ...existingFiles];

      // Create a set of existing UIDs to check duplicates
      const existingUIDs = new Set(combinedFiles.map(f => f.uid));

      const newValidFiles = [];

      for (const file of incomingFiles) {
        // Check allowed type
        if (!allowedTypes.includes(file.type)) {
          errorMessages.push(`${file.name}: unsupported file type`);
          continue;
        }

        // Check size limit
        if (file.size / 1024 / 1024 > 25) {
          errorMessages.push(`${file.name}: exceeds 25MB`);
          continue;
        }

        const uid = getFileUID(file);

        // Check duplicate
        if (existingUIDs.has(uid)) {
          const warnMsg = `${file.name}: You have already uploaded this file.`;
          // Show warning message popup for duplicate
          message.warning(warnMsg);
          errorMessages.push(warnMsg);
          continue; // skip duplicates
        }

        // Check max file limit 5
        if (prevFiles.length + newValidFiles.length + existingFiles.length >= 5) {
          errorMessages.push(`${file.name}: exceeds 5 file limit`);
          continue;
        }

        file.uid = uid;
        newValidFiles.push(file);
        existingUIDs.add(uid);
      }

      if (errorMessages.length > 0) {
        setFileError(errorMessages.join('; '));
      } else {
        setFileError('');
      }

      return [...prevFiles, ...newValidFiles];
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Upload your portfolio or recent works</p>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item className="mb-6">
          <Dragger
            name="file"
            multiple
            fileList={[]}
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">
                Max 5 files total. Each under 25MB. PNG, JPG, MP4, MOV, PDF, DOC, DOCX
              </p>
            </div>
          </Dragger>
          {fileError && (
            <p className="text-red-500 text-sm mt-2 text-center">{fileError}</p>
          )}
        </Form.Item>

        {/* Preview */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {(existingFiles.concat(fileList)).map((file, index) => {
            const previewUrl = file.url || (file.previewUrl ?? URL.createObjectURL(file));
            if (!file.previewUrl && !file.url) file.previewUrl = previewUrl;
            const isImage = file.type === 'image' || file.type?.includes('image');
            const isVideo = file.type === 'video' || file.type?.includes('video');
            const isPDF = file.type === 'pdf' || file.type?.includes('pdf');
            const isDoc = file.type === 'doc' || file.type?.includes('word') || file.type?.includes('officedocument');


            return (
              <div key={`${file.uid}-${index}`} className="relative w-[100px] h-[120px] rounded-lg overflow-hidden bg-gray-100 items-center justify-center p-2">
                {isImage ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                ) : isVideo ? (
                  <video src={previewUrl} className="w-full h-full object-cover" controls autoPlay muted loop />
                ) : isPDF || isDoc ? (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                    {file.name}
                  </a>
                ) : (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                    File
                  </a>
                )}
                <button
                  className="absolute top-1 right-1 bg-black flex items-center justify-center w-7 h-7 hover:bg-black/80 text-white p-1 rounded-full"
                  onClick={() => handleRemove(file.uid)}
                  type="button"
                >
                  <DeleteOutlined />
                </button>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="border-t border-gray-200 w-full" />
          <span className="px-4 text-gray-500 text-sm">Or</span>
          <span className="border-t border-gray-200 w-full" />
        </div>

        <Form.Item
          label={<span className="font-semibold text-sm text-gray-800">Portfolio URL</span>}
          validateStatus={portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl) ? 'warning' : ''}
          help={portfolioUrl && !/^https?:\/\/.+/.test(portfolioUrl) ? 'Enter a valid URL (https://...)' : ''}
        >
          <Input
            placeholder="https://"
            size="large"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

       <Form.Item className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Languages <span className="text-red-500">*</span></label>
            <Select
              mode="multiple"
              size="large"
              style={{ width: "100%" }}
              placeholder={loadingLanguages ? "Loading languages..." : "Select Languages"}
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              className="mb-6"
              loading={loadingLanguages}
            >
              {languages.map(({ id, name }) => (
                <Option key={id} value={id}>{name}</Option>
              ))}
            </Select>
            {selectedLanguages.length === 0 && (
              <div className="text-red-500 text-sm mb-4 mt-2">
                Please select at least one language
              </div>
            )}
          </Form.Item>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
            type="button"
          >
            Back
          </button>
          <button
            type="submit" 
            onClick={handleSubmit} 
            className="bg-[#121A3F] cursor-pointer text-white inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
};

export default PortfolioUploader;
