import React, { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

interface UploadResponse {
  document_id: number;
  document_type: string;
  document_name: string;
  document_size: string;
  document_upload_at: string;
  file_path: string;
}

const CameraCapture: React.FC<Props> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [captured, setCaptured] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Start camera when component becomes visible
  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setMessage("Unable to access camera. Check permissions.");
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");
    setCaptured(dataURL);
    setMessage("Photo captured. Click Upload to send.");
  };

  const handleUpload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setMessage("Nothing to upload. Capture a photo first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // Canvas → Blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
      );

      if (!blob) {
        setMessage("Failed to create image blob.");
        setIsUploading(false);
        return;
      }

      const fileName = `camera_capture_${Date.now()}.jpeg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + "MB";
      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

      

       const formData = new FormData();
      formData.append("file", file); // must match @RequestParam("file")
      formData.append("documentType", file.type || "UNKNOWN");
      formData.append("docName", file.name);
      formData.append("size", sizeInMB);
      formData.append("docUploadDate", today);

      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: UploadResponse = await response.json();
      console.log("Uploaded model:", data);
      setMessage("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        width: 350,
      }}
    >
      <h3>Camera</h3>

      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button onClick={capturePhoto}>📸 Capture</button>

        {/* Show Upload button only AFTER a photo is captured */}
        {captured && (
          <button onClick={handleUpload} disabled={isUploading}>
            ⬆️ {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}

        <button onClick={onClose}>Close</button>
      </div>

      {captured && (
        <img
          src={captured}
          alt="Captured"
          style={{ width: "100%", marginTop: 10 }}
        />
      )}

      {message && (
        <p style={{ marginTop: 8, fontSize: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CameraCapture;
