import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CameraCapture from "./CameraCapture";

interface UploadResponse {
  docId: number;
  documentType : string;
  docName: string;
  size: string;
  docUploadDate: string;
  filePath: string;
}

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastUpload, setLastUpload] = useState<UploadResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePlusClick = () => {
    setShowOptions(true);
  };

  const openCamera = () => {
    setShowOptions(false);
    setShowCamera(true);
  };

  const openFilePicker = () => {
    setShowOptions(false);
    fileInputRef.current?.click();
  };

  // Just store the file, do NOT upload yet
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);
    setSelectedFile(file);
    setMessage(`Selected: ${file.name}. Click Upload to continue.`);
    // allow selecting the same file later if needed
    e.target.value = "";
  };

  // Upload only when user clicks Upload button
  const handleUploadSelectedFile = async () => {
    if (!selectedFile) {
      setMessage("No file selected.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const file = selectedFile;

      // const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + "MB";

      // const today = new Date()
      //   .toLocaleDateString("en-GB")
      //   .replace(/\//g, "-");

      const formData = new FormData();
      formData.append("file", file); // must match @RequestParam("file")
      formData.append("documentType", file.type || "UNKNOWN");
      // formData.append("docName", file.name);
      // formData.append("size", sizeInMB);
      // formData.append("docUploadDate", today);
      formData.append("userId", 1);

      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: UploadResponse = await response.json();
      console.log("Uploaded model (gallery):", data);

      setLastUpload(data);
      setMessage("File uploaded successfully!");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <FaPlus
        size={40}
        onClick={handlePlusClick}
        style={{ cursor: "pointer" }}
      />

      {/* Popup */}
      {showOptions && (
        <div
          style={{
            marginTop: 10,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
            width: 200,
            background: "#fff",
          }}
        >
          <p
            onClick={openCamera}
            style={{ cursor: "pointer", margin: 10 }}
          >
            📷 Take Photo
          </p>

          <p
            onClick={openFilePicker}
            style={{ cursor: "pointer", margin: 10 }}
          >
            🖼️ Choose From Gallery
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="/*" // or "*/*" if you want all file types
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      {/* Camera Component (opens when selected) */}
      {showCamera && (
        <CameraCapture onClose={() => setShowCamera(false)} />
      )}

      {/* Selected file info + Upload button */}
      {selectedFile && (
        <div
          style={{
            marginTop: 15,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            Selected file: <strong>{selectedFile.name}</strong>
          </p>
          <button
            onClick={handleUploadSelectedFile}
            disabled={isUploading}
            style={{ marginRight: 8 }}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={clearSelectedFile}>Cancel</button>
        </div>
      )}

      {/* Status / result */}
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
      {lastUpload && (
        <div style={{ marginTop: 10, fontSize: 12 }}>
          <div>Last upload: {lastUpload.docName}</div>
          <div>Path: {lastUpload.filePath}</div>
        </div>
      )}
    </div>
  );
};

export default Upload;
