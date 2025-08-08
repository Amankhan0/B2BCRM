import React, { useEffect, useState } from 'react';
import useFileDownload from './use-file-download';

const FileRenderer = ({ fileId }) => {
  const {
    fileData,
    fileType,
    loading,
    error,
    isImage,
    isPdf,
    downloadFile
  } = useFileDownload();

  const [renderAttempted, setRenderAttempted] = useState(false);

  useEffect(() => {
    if (fileId && !renderAttempted) {
      downloadFile(fileId);
      setRenderAttempted(true);
    }
  }, [fileId, downloadFile, renderAttempted]);

  if (loading) {
    return <div className="loading">Loading file...</div>;
  }

  if (error) {
    return <div className="error">Error loading file: {error}</div>;
  }

  if (!fileData) {
    return <div className="no-data">No file data available</div>;
  }

  if (isImage) {
    return (
      <div className="image-container">
        <img 
          src={fileData} 
          alt="File content" 
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="pdf-container">
        <iframe 
          src={fileData} 
          title="PDF Viewer" 
          width="100%" 
          height="600px" 
          style={{ border: 'none' }}
        />
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className="file-info">
      <p>File loaded (type: {fileType})</p>
      <p>This file type cannot be previewed directly.</p>
      <a 
        href={fileData} 
        download={`download.${fileType.split('/')[1] || 'file'}`}
        className="download-link"
      >
        Download File
      </a>
    </div>
  );
};

export default FileRenderer;