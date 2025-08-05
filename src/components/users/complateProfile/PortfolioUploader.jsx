import React, { useState, useEffect } from 'react';
import { Upload, Form, Input, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const PortfolioUploader = ({ onBack, onNext }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [urls, setUrls] = useState(['']);

  // 🔁 Load data from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("portfolioFiles");
    const savedUrls = localStorage.getItem("portfolioUrls");

    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFileList(parsedFiles);
      } catch (e) {
        console.error("Invalid saved files", e);
      }
    }

    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls);
        if (Array.isArray(parsedUrls)) setUrls(parsedUrls);
      } catch (e) {
        console.error("Invalid saved urls", e);
      }
    }
  }, []);

  const beforeUpload = (file) => {
    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg',
      'video/mp4', 'video/quicktime',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isAllowed = allowedTypes.includes(file.type);
    const isLt25M = file.size / 1024 / 1024 < 25;

    if (!isAllowed) message.error('Only PNG, JPG, MP4, MOV, PDF, DOC, DOCX files are allowed');
    if (!isLt25M) message.error('File must be smaller than 25MB');

    return isAllowed && isLt25M;
  };

  const handleRemove = (uid) => {
    setFileList(prev => prev.filter(file => file.uid !== uid));
  };

  const handleUrlChange = (index, e) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    const lastUrl = urls[urls.length - 1];
    const isValid = /^https?:\/\/.+/.test(lastUrl);

    if (!lastUrl.trim()) {
      message.warning("Please fill in the current URL before adding another.");
      return;
    }

    if (!isValid) {
      message.warning("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setUrls([...urls, '']);
  };

  const removeUrlField = (index) => {
    if (urls.length === 1) return;
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = () => {
    const validUrls = urls.filter(url => url.trim());

    localStorage.setItem("portfolioFiles", JSON.stringify(fileList));
    localStorage.setItem("portfolioUrls", JSON.stringify(validUrls));

    console.log('Files:', fileList);
    console.log('Portfolio URLs:', validUrls);

    onNext?.({ files: fileList, portfolioUrls: validUrls });
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Upload your portfolio or recent works</p>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Upload Area */}
        <Form.Item className="mb-6">
          <Dragger
            name="file"
            multiple
            fileList={[]} // prevent AntD from auto-controlling
            beforeUpload={(file) => {
              if (beforeUpload(file)) {
                setFileList([...fileList, { ...file, uid: `${Date.now()}-${file.name}` }]);
              }
              return false;
            }}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">
                Supported: PNG, JPG, MP4, MOV, PDF, DOC, DOCX under 25MB
              </p>
            </div>
          </Dragger>
        </Form.Item>

        {/* File Preview */}
        {fileList.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-8 flex-wrap justify-center">
            {fileList.map(file => {
              const isImage = file.type?.startsWith('image/');
              const previewUrl = URL.createObjectURL(file.originFileObj || file);
              return (
                <div key={file.uid} className="relative w-[100px] h-[120px] rounded-lg overflow-hidden">
                  {isImage ? (
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <video src={previewUrl} className="w-full h-full object-cover" />
                  )}
                  <button
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
                    onClick={() => handleRemove(file.uid)}
                    type="button"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="border-t border-gray-200 w-full" />
          <span className="px-4 text-gray-500 text-sm">Or</span>
          <span className="border-t border-gray-200 w-full" />
        </div>

        {/* URL Fields */}
        {urls.map((url, index) => (
          <Form.Item
            key={index}
            label={index === 0 ? <span className="font-semibold text-sm text-gray-800">Add Portfolio URL</span> : null}
            validateStatus={url && !/^https?:\/\/.+/.test(url) ? 'warning' : ''}
            help={url && !/^https?:\/\/.+/.test(url) ? 'Please enter a valid URL (https://...)' : ''}
          >
            <Input
              placeholder="https://"
              size="large"
              value={url}
              onChange={(e) => handleUrlChange(index, e)}
              className="rounded-lg"
              suffix={
                <div className="flex items-center gap-1">
                  {urls.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="large"
                      onClick={() => removeUrlField(index)}
                      className="p-2 bg-gray-100"
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                  {index === urls.length - 1 && (
                    <Button
                      type="text"
                      size="large"
                      onClick={addUrlField}
                      className="p-2 bg-gray-100"
                    >
                      <PlusOutlined />
                    </Button>
                  )}
                </div>
              }
            />
          </Form.Item>
        ))}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
          >
            Back
          </button>
          <button
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
