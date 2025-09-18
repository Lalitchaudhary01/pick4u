import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadKYC } from "../../api/driverApi"; // Axios wrapper

const KYCUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  // JWT + Role check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "driver") {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please select files to upload");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await uploadKYC(files, token); // API wrapper
      setMessage(res.message || "Files uploaded successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error uploading files");
    }
  };

  return (
    <div>
      <h2>Upload KYC Documents</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default KYCUpload;
