import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setResponseMessage("");
      setUploadStatus("");
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const apiUrl = "https://your-api-gateway-endpoint"; // Replace with your API Gateway endpoint

    try {
      setUploadStatus("Uploading...");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream", // Send raw binary data
          "File-Name": selectedFile.name, // Send file name in headers
        },
        body: selectedFile,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResponseMessage(`Success: ${result.message}`);
      setUploadStatus("Upload Successful!");
    } catch (error) {
      console.error("Error during file upload:", error);
      setResponseMessage("Error: File upload failed.");
      setUploadStatus("Upload Failed.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>File Upload Test</h1>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
      <br />
      <button onClick={uploadFile} style={{ padding: "10px 20px" }}>
        Upload File
      </button>
      {uploadStatus && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Status: {uploadStatus}
        </p>
      )}
      {responseMessage && (
        <p
          style={{
            marginTop: "10px",
            color: uploadStatus === "Upload Successful!" ? "green" : "red",
          }}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default App;
