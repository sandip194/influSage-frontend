import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileUnknownOutlined,
} from '@ant-design/icons';

const { Dragger } = Upload;

const CampaignStep4 = ({ onBack, onNext }) => {
    const [fileList, setFileList] = useState([]);

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

    const handleContinue = () => {
        // if (fileList.length === 0) {
        //     message.error("Please upload at least one reference file.");
        //     return;
        // }

        onNext?.({ files: fileList.map(f => f.file) }); // send raw files to next step
    };

    return (
        <div className="bg-white p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Reference</h2>

            {/* Upload Section */}
            <Dragger
                name="file"
                multiple
                fileList={[]}
                beforeUpload={(file) => {
                    if (beforeUpload(file)) {
                        setFileList(prev => [
                            ...prev,
                            {
                                uid: `${Date.now()}-${file.name}`,
                                file,
                            },
                        ]);
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

            {/* File Preview */}
            {fileList.length > 0 && (
                <div className="flex gap-3 overflow-x-auto mb-8 flex-wrap justify-center mt-6">
                    {fileList.map(({ uid, file }) => {
                        const { type } = file;
                        const isImage = type.startsWith('image/');
                        const isVideo = type.startsWith('video/');
                        const isPdf = type === 'application/pdf';
                        const isDoc = type.includes('word');
                        const previewUrl = URL.createObjectURL(file);

                        return (
                            <div
                                key={uid}
                                className="relative w-[100px] h-[120px] rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center"
                            >
                                {isImage ? (
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : isVideo ? (
                                    <video
                                        src={previewUrl}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                      />
                                ) : isPdf ? (
                                    <FilePdfOutlined className="text-4xl text-red-500" />
                                ) : isDoc ? (
                                    <FileWordOutlined className="text-4xl text-blue-500" />
                                ) : (
                                    <FileUnknownOutlined className="text-4xl text-gray-500" />
                                )}

                                <button
                                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
                                    onClick={() => handleRemove(uid)}
                                    type="button"
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-[#121A3F] cursor-pointer text-white inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CampaignStep4;
