import React, { useState } from 'react';
import { Upload, Form, Input, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const PortfolioUploader = ({ onBack, onNext }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
    const [urls, setUrls] = useState(['']);

  const beforeUpload = (file) => {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
    'application/msword',                // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  const isAllowed = allowedTypes.includes(file.type);
  const isLt25M = file.size / 1024 / 1024 < 25;

  if (!isAllowed) {
    message.error('Only PNG, JPG, MP4, MOV, PDF, DOC, DOCX files are allowed');
  }
  if (!isLt25M) {
    message.error('File must be smaller than 25MB');
  }

  return isAllowed && isLt25M;
};


  const handleRemove = (uid) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };

  // Handle URL input changes
  const handleUrlChange = (index, e) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
  };

   // Add new URL input
  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  // Remove URL input
  const removeUrlField = (index) => {
    if (urls.length === 1) return; // Keep at least one field
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = (values) => {
    // Instead of values.portfolioUrl, use urls state array
    console.log('Files:', fileList);
    console.log('Portfolio URLs:', urls);
    onNext?.({ files: fileList, portfolioUrls: urls.filter(url => url.trim() !== '') });
  };


  return (
    <div className="bg-white p-6 rounded-3xl ">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Upload your portfolio or recent works</p>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Upload Area */}
        <Form.Item className="mb-6">
          <Dragger
            name="file"
            multiple
            fileList={[]}
            beforeUpload={(file) => {
              if (beforeUpload(file)) {
                setFileList([...fileList, file]);
              }
              return false; // stop auto upload
            }}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">
                Supported files PNG, JPG, MP4, MOV, PDF, DOC, DOCX less than 25 MB
              </p>
            </div>
          </Dragger>
        </Form.Item>

        {/* Thumbnails Preview */}
        {fileList.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-8">
            {fileList.map((file) => {
              const isImage = file.type.startsWith('image/');
              const previewUrl = URL.createObjectURL(file);

              return (
                <div key={file.uid} className="relative w-[100px] h-[120px] rounded-lg overflow-hidden">
                  {isImage ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <video src={previewUrl} className="object-cover w-full h-full" />
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

        {/* URL Input */}
        {urls.map((url, index) => (
          <Form.Item
            key={index}
            label={index === 0 ? <span className="font-semibold text-sm text-gray-800">Add Portfolio URL</span> : null}
            validateStatus={
              url && !/^https?:\/\/.+/.test(url)
                ? 'warning'
                : ''
            }
            help={
              url && !/^https?:\/\/.+/.test(url)
                ? 'Please enter a valid URL (https://...)'
                : ''
            }
          >
            <Input
              placeholder="https://"
              size="large"
              className="rounded-lg"
              value={url}
              onChange={(e) => handleUrlChange(index, e)}
              suffix={
                <div className="flex items-center gap-1">
                  {urls.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="large"
                      onClick={() => removeUrlField(index)}
                      className='p-2 bg-grey-100'
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                  {index === urls.length - 1 && (
                    <Button
                      type="text"
                      size="large"
                      className='p-2 bg-grey-100'
                      onClick={addUrlField}
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
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button onClick={onBack} className="w-full sm:w-auto border border-gray-300">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-800 text-white"
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PortfolioUploader;
