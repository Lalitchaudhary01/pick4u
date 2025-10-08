import React, { useState } from "react";
import axios from "axios";

export default function DriverKYCUpload() {
  const [files, setFiles] = useState([]);
  const [license, setLicense] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!license || !aadhar || files.length === 0) {
      setMessage("License, Aadhar, and at least 1 document are required");
      return;
    }

    const formData = new FormData();
    formData.append("licenseNumber", license);
    formData.append("aadharNumber", aadhar);
    files.forEach((file) => formData.append("docs", file));

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token"); // JWT from login
      const res = await axios.post(
        "http://localhost:5000/api/driver/kyc",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "KYC uploaded successfully!");
      setFiles([]);
      setLicense("");
      setAadhar("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Driver KYC Upload</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="License Number"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Aadhar Number"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded"
        >
          {loading ? "Uploading..." : "Submit KYC"}
        </button>
      </form>

      {files.length > 0 && (
        <div className="mt-4">
          <p>Selected files:</p>
          <ul className="list-disc list-inside">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
