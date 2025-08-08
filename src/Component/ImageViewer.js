import { useEffect, useState } from "react";
import useFileDownload from "./use-file-download";

const ImageViewer = ({ fileId }) => {
  const { fileData, isImage, downloadFile, loading, error } = useFileDownload();

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (fileId) {
      downloadFile(fileId).then((result) => {
        if (result?.fileUrl) {
          setImageUrl(result.fileUrl);
        }
      });
    }
  }, [fileId]);

  if (loading) return <p>Loading image...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      {isImage && imageUrl ? (
        <img src={imageUrl} alt="Fetched from API" style={{ maxWidth: "100%", height: "auto" }} />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default ImageViewer;
