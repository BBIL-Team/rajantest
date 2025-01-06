import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css"; // Optional: Add your own styles if needed

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [markedDate, setMarkedDate] = useState<Date | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    try {
      const response = await fetch(
        "https://w5rtfqjj88.execute-api.ap-south-1.amazonaws.com/default/rajantest12345", // Replace with your Lambda endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: selectedFile.name }),
        }
      );

      if (response.ok) {
        setUploadMessage("File uploaded successfully!");
        setMarkedDate(new Date()); // Mark the current day as successful
      } else {
        setUploadMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadMessage("An error occurred while uploading the file.");
      console.error(error);
    }
  };

  const isDateMarked = (date: Date): boolean => {
    return !!markedDate && date.toDateString() === markedDate.toDateString();
  };

  const tileClassName = ({ date }: { date: Date }) => {
    if (isDateMarked(date)) {
      return "success-day"; // Add a custom class for marked dates
    }
    return null;
  };

  return (
    <div className="App">
      <h1>File Upload and Calendar</h1>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
      <div className="calendar-section">
        <h2>Upload Calendar</h2>
        <Calendar tileClassName={tileClassName} />
      </div>
    </div>
  );
};

export default App;
