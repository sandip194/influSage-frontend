import React, { useState } from "react";
import { Upload, Form, Input, Button } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { RiChatUploadLine, RiDeleteBin6Line } from "react-icons/ri";

const { Dragger } = Upload;

const PortfolioUploader = ({ onBack, onNext }) => {
  const [form] = Form.useForm();
  const [urls, setUrls] = useState([""]);
  const [fileList, setFileList] = useState([]);

  // URL handlers
  const handleUrlChange = (index, e) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
  };

  const addUrlField = () => setUrls([...urls, ""]);
  const removeUrlField = (index) => {
    if (urls.length === 1) return;
    setUrls(urls.filter((_, i) => i !== index));
  };

  // File upload handler (no API, just preview)
  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Portfolio
      </h2>

      <Form layout="vertical" form={form}>
        {/* File Upload */}
        <section>
          <Dragger
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleUpload}
            accept=".png,.jpg,.jpeg,.pdf,.mp4"
            fileList={fileList}
          >
            <p className="ant-upload-drag-icon">
              <RiChatUploadLine className="text-2xl text-gray-600 mx-auto" />
            </p>
            <p className="ant-upload-text font-semibold">Upload Files</p>
            <p className="ant-upload-hint text-sm text-gray-500">
              Supported files: PNG, JPG, MP4, PDF (Max 5MB)
            </p>
          </Dragger>
        </section>

        {/* Uploaded references preview */}
        <div className="references py-4 border-b border-gray-200">
          <div className="flex gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative w-48 h-40 rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src="https://images.pexels.com/photos/32429493/pexels-photo-32429493.jpeg"
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
                <button className="absolute cursor-pointer top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
                  <RiDeleteBin6Line className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

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
            label={
              index === 0 ? (
                <span className="font-semibold text-sm text-gray-800">
                  Add Portfolio URL
                </span>
              ) : null
            }
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            onClick={onNext}
            className="bg-[#121A3F] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#0D132D]"
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
};

export default PortfolioUploader;
