import React, { useState, useEffect } from 'react';
import { Upload, Form, Input, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useSelector } from 'react-redux';

const { Dragger } = Upload;

const PortfolioUploader = ({ onBack, onNext, data }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]); // files from backend (as URLs)
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const { token } = useSelector(state => state.auth);


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
    if (uid.startsWith("existing-")) {
      setExistingFiles(prev => prev.filter(file => file.uid !== uid));
    } else {
      setFileList(prev => prev.filter(file => file.uid !== uid));
    }
  };


  const handleSubmit = async () => {
    const hasFiles = fileList.length > 0 || existingFiles.length > 0;
    const isValidUrl = /^https?:\/\/.+/.test(portfolioUrl);

    if (!hasFiles && !isValidUrl) {
      message.error('Please upload at least one file or add a valid portfolio URL.');
      return;
    }

    const formData = new FormData();

    // Build file paths from existing files
    const existingFilePaths = existingFiles.map(file => ({
      filepath: file.url.startsWith('http') ? file.url.replace('http://localhost:3001/', '') : file.url,
    }));

    // This is the critical part: we always include portfoliojson, whether or not files are added
    const portfoliojson = {
      portfoliourl: isValidUrl ? portfolioUrl : null,
      filepaths: existingFilePaths.length > 0 ? existingFilePaths : [{ filepath: null }],
    };

    formData.append("portfoliojson", JSON.stringify(portfoliojson));

    // Append new files
    fileList.forEach(file => {
      formData.append("portfolioFiles", file);
    });

    try {
      const res = await axios.post("user/complete-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      if (res.status === 200) {
        message.success("Portfolio submitted successfully!");
        onNext?.();
      } else {
        message.error("Something went wrong.");
      }
    } catch (err) { 
      console.error("Submit error:", err);
      message.error("Failed to submit portfolio.");
    }
  };




  useEffect(() => {
    console.log(data)
    if (data) {
      if (data.portfoliourl) {
        setPortfolioUrl(data.portfoliourl);
      }

      if (Array.isArray(data.filepaths)) {
        const filesFromBackend = data.filepaths
          .filter(f => f.filepath)
          .map((f, index) => {
            const fullUrl = f.filepath.startsWith('http')
              ? f.filepath
              : `http://localhost:3001/${f.filepath.replace(/^\/?/, '')}`; // make sure no double slashes

            const fileName = f.filepath.split('/').pop()?.toLowerCase() || '';
            const isImage = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
            const isVideo = fileName.endsWith('.mp4') || fileName.endsWith('.mov');
            const isPDF = fileName.endsWith('.pdf');
            const isDoc = fileName.endsWith('.doc') || fileName.endsWith('.docx');

            return {
              uid: `existing-${index}`,
              name: fileName,
              url: fullUrl,
              status: 'done',
              type: isImage
                ? 'image'
                : isVideo
                  ? 'video'
                  : isPDF
                    ? 'pdf'
                    : isDoc
                      ? 'doc'
                      : 'file',
            };
          });

        setExistingFiles(filesFromBackend);
      }
    }
  }, [data]);





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
            beforeUpload={(file) => {
              if (beforeUpload(file)) {
                setFileList(prev => [...prev, file]);
              }
              return false;
            }}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">Supported: PNG, JPG, MP4, MOV, PDF, DOC, DOCX under 25MB</p>
            </div>
          </Dragger>
        </Form.Item>

        {/* Preview */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {(fileList.concat(existingFiles)).map(file => {
            const previewUrl = file.thumbUrl || file.url || URL.createObjectURL(file);


            const type = file.type || '';
            const isImage = type === 'image' || type.startsWith('image/');
            const isVideo = type === 'video' || type.startsWith('video/');
            const isPDF = type === 'pdf' || type === 'application/pdf';
            const isDoc = type === 'doc' || type.includes('msword') || type.includes('officedocument');


            return (
              <div key={file.uid} className="relative w-[100px] h-[120px] rounded-lg overflow-hidden bg-gray-100 items-center justify-center p-2">
                {isImage ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                ) : isVideo ? (
                  <video src={previewUrl} className="w-full h-full object-cover" controls autoPlay muted loop />
                ) : isPDF ? (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                    PDF
                  </a>
                ) : isDoc ? (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                    DOC
                  </a>
                ) : (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                    File
                  </a>
                )}

                {/* Remove Button */}
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


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onBack}
            className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            htmlType="submit"
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
