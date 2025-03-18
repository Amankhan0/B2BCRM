import { useState, useEffect } from 'react';
import { download } from '../Constants/Constants';
import { getAuthToken } from '../Storage/Storage';

const useFileDownload = (options = {}) => {
  const { autoLoad = false, fileId, requestType } = options;
  
  const [fileData, setFileData] = useState(null);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Download the file from the API
  const downloadFile = async (customFileId, customRequestType) => {
    // Use provided params or fall back to options
    const targetFileId = customFileId || fileId;
    const targetRequestType = customRequestType || requestType;
    
    if (!targetFileId) {
      setError("File ID is required");
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("_id", targetFileId);
      formData.append("requestType", targetRequestType || "");

      // Make API call with FormData
      const response = await fetch(download, {
        headers: {
          Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : 'token',
        },
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert response to Blob
      const blob = await response.blob();
      const mimeType = blob.type;

      if (!blob.size) {
        throw new Error("Received empty file");
      }

      // Create Object URL
      const fileUrl = URL.createObjectURL(blob);
      setFileData(fileUrl);
      setFileType(mimeType);
      
      return { fileUrl, mimeType };
    } catch (err) {
      const errorMsg = err.message || "Failed to download file";
      setError(errorMsg);
      console.error("Error downloading file:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Force download a file to user's computer
  const saveFile = (filename = "downloaded-file") => {
    if (!fileData) {
      setError("No file data available");
      return false;
    }

    // Generate appropriate extension based on mime type
    let extension = "";
    if (fileType === "application/pdf") {
      extension = ".pdf";
    } else if (fileType.startsWith("image/")) {
      extension = `.${fileType.split("/")[1]}`;
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extension = ".docx";
    } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      extension = ".xlsx";
    }

    // Create download link and trigger click
    const link = document.createElement("a");
    link.href = fileData;
    link.download = `${filename}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  };

  // Clear current file data
  const clearFile = () => {
    if (fileData) {
      URL.revokeObjectURL(fileData);
    }
    setFileData(null);
    setFileType('');
    setError(null);
  };

  // Auto-load file if configured
  useEffect(() => {
    if (autoLoad && fileId) {
      downloadFile();
    }
    
    // Cleanup function to revoke Object URL when component unmounts
    return () => {
      if (fileData) {
        URL.revokeObjectURL(fileData);
      }
    };
  }, [autoLoad, fileId]);

  return {
    fileData,
    fileType,
    loading,
    error,
    isImage: fileType.startsWith('image/'),
    isPdf: fileType === 'application/pdf',
    isWord: fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    isExcel: fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    downloadFile,
    saveFile,
    clearFile
  };
};

export default useFileDownload;