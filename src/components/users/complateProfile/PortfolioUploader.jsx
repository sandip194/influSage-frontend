import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upload, Form, Input, message, Select, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const { Dragger } = Upload;
const { Option } = Select;

const ALLOWED_TYPES = [
  'image/png', 'image/jpeg', 'image/jpg',
  'video/mp4', 'video/quicktime',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 25;

function getFileTypeFromExt(ext) {
  ext = ext.toLowerCase();
  if (['png', 'jpg', 'jpeg'].includes(ext)) return 'image';
  if (['mp4', 'mov'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'file';
}

const FilePreview = React.memo(({ file, onRemove }) => {
  const { uid, name, url, previewUrl, type } = file;
  // Decide display
  const isImage = type === 'image' || (type && type.includes('image'));
  const isVideo = type === 'video' || (type && type.includes('video'));
  const isPDF = type === 'pdf' || (type && type === 'pdf');
  const isDoc = type === 'doc' || (type && (type.includes('word') || type.includes('officedocument')));

  const displayUrl = url || previewUrl;

  return (
    <div
      key={uid}
      className="relative w-[100px] h-[120px] rounded-lg overflow-hidden bg-gray-100 items-center justify-center p-2"
    >
      {isImage ? (
        <img
          src={displayUrl}
          alt={name || 'preview'}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : isVideo ? (
        <video src={displayUrl} className="w-full h-full object-cover" controls autoPlay muted loop />
      ) : isPDF || isDoc ? (
        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
          {name}
        </a>
      ) : (
        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
          File
        </a>
      )}
      <button
        className="absolute top-1 right-1 bg-black flex items-center justify-center w-7 h-7 hover:bg-black/80 text-white p-1 rounded-full"
        onClick={() => onRemove(uid)}
        type="button"
      >
        <DeleteOutlined />
      </button>
    </div>
  );
});

const PortfolioUploader = ({ onBack, onNext, data, showControls, showToast, onSave }) => {
  const [form] = Form.useForm();
  const { token, userId } = useSelector(state => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [fileList, setFileList] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [deletedFilePaths, setDeletedFilePaths] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine existing + new for previews etc, memoized to avoid recomputation
  const combinedFiles = useMemo(() => [...existingFiles, ...fileList], [existingFiles, fileList]);

  // Fetch languages
  useEffect(() => {
    let mounted = true;
    const fetchLanguages = async () => {
      try {
        setLoadingLanguages(true);
        const res = await axios.get('languages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted) {
          setLanguages(res.data.languages || []);
        }
      } catch (err) {
        console.error('Error fetching languages:', err);
      } finally {
        if (mounted) setLoadingLanguages(false);
      }
    };
    fetchLanguages();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Initialize from data
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
            const ext = fileName.split('.').pop() || '';
            const type = getFileTypeFromExt(ext);
            return {
              uid: `existing-${index}`,
              name: fileName,
              url: fullUrl,
              type,
            };
          });
        setExistingFiles(filesFromBackend);
      }

      const langs = data.languages ?? data.contentlanguages ?? [];
      if (Array.isArray(langs)) {
        const selectedIds = langs
          .map(l => l.languageid)
          .filter(id => languages.some(lang => lang.id === id));
        setSelectedLanguages(selectedIds);
      }
    }
  }, [data, languages, BASE_URL]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      fileList.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [fileList]);

  const getFileUID = useCallback((file) => {
    // fallback if lastModified is missing
    const lm = file.lastModified || Date.now();
    return `${file.name}-${file.size}-${lm}`;
  }, []);

  const handleRemove = useCallback((uid) => {
    setFileError('');
    uploadedUIDsRef.current.delete(uid);

    if (uid.startsWith('existing-')) {
      const fileToRemove = existingFiles.find(f => f.uid === uid);
      if (!fileToRemove) return;

      const relativePath = fileToRemove.url.replace(`${BASE_URL}/`, '');
      setDeletedFilePaths(prev => [...prev, relativePath]);
      setExistingFiles(prev => prev.filter(f => f.uid !== uid));
    } else {
      setFileList(prev => prev.filter(f => f.uid !== uid));
    }
  }, [existingFiles, BASE_URL]);


  const uploadedUIDsRef = useRef(new Set());

  const handleFileChange = useCallback((info) => {
    const rawFiles = (info.fileList || [])
      .map(f => f.originFileObj || f)
      .filter(Boolean);

    const newValidFiles = [];
    const newErrors = [];

    for (const file of rawFiles) {
      const uid = getFileUID(file);

      if (uploadedUIDsRef.current.has(uid)) continue; // Skip duplicates

      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: unsupported file type`);
        continue;
      }

      const sizeMb = file.size / 1024 / 1024;
      if (sizeMb > MAX_SIZE_MB) {
        newErrors.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB`);
        continue;
      }

      file.uid = uid;
      file.previewUrl = URL.createObjectURL(file);
      newValidFiles.push(file);
      uploadedUIDsRef.current.add(uid);
    }

    const totalCount = existingFiles.length + fileList.length + newValidFiles.length;
    if (totalCount > MAX_FILES) {
      const allowedToAdd = MAX_FILES - (existingFiles.length + fileList.length);
      if (allowedToAdd <= 0) {
        newErrors.push(`You can upload a maximum of ${MAX_FILES} files.`);
        newValidFiles.length = 0;
      } else {
        newErrors.push(`Only ${allowedToAdd} more file(s) allowed.`);
        newValidFiles.length = allowedToAdd;
      }
    }

    if (newErrors.length > 0) {
      setFileError(newErrors.join('; '));
    } else {
      setFileError('');
    }

    if (newValidFiles.length > 0) {
      setFileList(prev => [...prev, ...newValidFiles]);
    }
  }, [existingFiles, fileList]);



  const handleSubmit = useCallback(async () => {
    // Prevent double submit
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const hasFiles = fileList.length > 0 || existingFiles.length > 0;
      const isValidUrl = /^https?:\/\/.+/.test(portfolioUrl);

      if (!hasFiles && !isValidUrl) {
        setFileError('Please upload at least one file or add a valid portfolio URL.');
        message.error('Please upload at least one file or add a valid portfolio URL.');
        return;
      }
      if (selectedLanguages.length === 0) {
        message.error('Please select at least one language.');
        return;
      }

      // Delete removed existing files
      for (const filepath of deletedFilePaths) {
        await axios.post(
          '/user/profile/delete-portfolio-file',
          { userId, filepath },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Prepare form data
      const formData = new FormData();

      const existingFilePaths = existingFiles.map(f => ({
        filepath: f.url.startsWith('http')
          ? f.url.replace(`${BASE_URL}/`, '')
          : f.url
      }));

      const selectedLanguagesData = selectedLanguages
        .map(langId => {
          const lang = languages.find(l => l.id === langId);
          return lang ? { languageid: lang.id, languagename: lang.name } : null;
        })
        .filter(Boolean);

      const portfoliojson = {
        portfoliourl: isValidUrl ? portfolioUrl : null,
        filepaths: existingFilePaths.length > 0
          ? existingFilePaths
          : [{ filepath: null }],
        languages: selectedLanguagesData
      };

      formData.append('portfoliojson', JSON.stringify(portfoliojson));
      fileList.forEach(f => {
        formData.append('portfolioFiles', f);
      });

      const res = await axios.post(
        'user/complete-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 200) {
        if (showToast) toast.success('Profile updated successfully!');

        if (onNext) onNext();
        if (onSave) onSave(formData);
      } else {
        message.error('Something went wrong.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      message.error('Failed to submit portfolio.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    fileList,
    existingFiles,
    deletedFilePaths,
    portfolioUrl,
    selectedLanguages,
    languages,
    userId,
    token,
    BASE_URL,
    onNext,
    onSave,
    showToast
  ]);

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Upload your portfolio or recent works</p>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item className="mb-6">
          <Dragger
            name="file"
            multiple
            fileList={[]}  // keeping this empty since we manage our own state
            beforeUpload={() => false}
            onChange={(info) => {
              handleFileChange(info);
              info.fileList.length = 0; // Clear internal list
            }}
            showUploadList={false}
          >
            <div className="py-10">
              <UploadOutlined className="text-2xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-800 text-md">Upload Files</p>
              <p className="text-gray-500 text-sm">
                Max {MAX_FILES} files total. Each under {MAX_SIZE_MB}MB. PNG, JPG, MP4, MOV, PDF, DOC, DOCX
              </p>
            </div>
          </Dragger>
          {fileError && (
            <p className="text-red-500 text-sm mt-2 text-center">{fileError}</p>
          )}
        </Form.Item>

        {/* Preview */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {combinedFiles.map(file => (
            <FilePreview key={file.uid} file={file} onRemove={handleRemove} />
          ))}
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
            onChange={e => setPortfolioUrl(e.target.value)}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Languages <span className="text-red-500">*</span></label>
          <Select
            mode="multiple"
            size="large"
            style={{ width: '100%' }}
            placeholder={loadingLanguages ? 'Loading languages...' : 'Select Languages'}
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
              disabled={isSubmitting}
              className={`bg-[#0D132D] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#121A3F] transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? <Spin size="small" /> : (onNext ? 'Continue' : 'Save Changes')}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default PortfolioUploader;
