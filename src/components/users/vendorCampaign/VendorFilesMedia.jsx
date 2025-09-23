import {
  RiFileDownloadFill,
} from '@remixicon/react';


const files = [
  { id: 1, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
  { id: 2, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 3, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
  { id: 4, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 5, name: "Wireframe.png", size: "2.4 MB", type: "image" },
  { id: 6, name: "Project Doc.pdf", size: "2.4 MB", type: "pdf" },
];

const VendorFilesMedia = () => {

  const getFileIcon = (type) => {
    if (type === "pdf")
      return (
        <img
          src="https://img.icons8.com/color/48/000000/pdf.png"
          alt="pdf"
          className="w-10 h-10"
        />
      );
    if (type === "image")
      return (
        <img
          src="https://img.icons8.com/color/48/000000/image.png"
          alt="img"
          className="w-10 h-10 rounded-md"
        />
      );
  };


  return (
    <div className="w-full text-sm overflow-x-hidden">


      {/* Content based on selected button */}
      <div className="bg-white p-4 rounded-2xl">
        <h3 className="font-semibold text-lg mb-4">Attachments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between border border-gray-200 rounded-2xl p-3 transition"
            >
              {/* File Info */}
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>

              {/* Download Icon */}
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <RiFileDownloadFill className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default VendorFilesMedia;
