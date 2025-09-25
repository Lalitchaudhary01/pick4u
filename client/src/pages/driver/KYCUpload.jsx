import React, { useState } from "react";
import { uploadKYC } from "../../api/driverApi";

const KYCUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadKYC(files, token);
      setMessage("✅ KYC uploaded successfully. Waiting for approval.");
    } catch (err) {
      setMessage("❌ Failed to upload KYC.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Upload KYC Documents</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default KYCUpload;
