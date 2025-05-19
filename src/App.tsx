import React, { useState } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const App: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");

  const downloadFile = async (month: string) => {
    try {
      const response = await fetch("https://e3blv3dko6.execute-api.ap-south-1.amazonaws.com/P1/presigned_urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_key: `${month}_Sample_File.csv` }),
      });
      console.log("Download Response status:", response.status, "OK:", response.ok);
      console.log("Download Response headers:", Object.fromEntries(response.headers.entries()));
      const data = await response.json();
      console.log("Download Response data:", data);
      if (response.ok && data.presigned_url) {
        const link = document.createElement("a");
        link.href = data.presigned_url;
        link.download = `${month}_Sample_File.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setResponseMessage(`Downloaded ${month}_Sample_File.csv successfully!`);
      } else {
        setResponseMessage(`Error: ${data.error || "Failed to fetch download link"} (Status: ${response.status})`);
      }
    } catch (error: any) {
      console.error("Download error:", error);
      setResponseMessage(`An error occurred while fetching the download link: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Minimal Download App</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          <option value="">Select Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <button
          disabled={!selectedMonth}
          onClick={() => downloadFile(selectedMonth)}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: selectedMonth ? "#007BFF" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: selectedMonth ? "pointer" : "not-allowed",
          }}
        >
          Download Sample CSV
        </button>
        {responseMessage && (
          <p
            style={{
              marginTop: "10px",
              color: responseMessage.includes("success") ? "green" : "red",
              fontSize: "16px",
            }}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
