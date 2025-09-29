import React, { useState } from "react";
import { uploadKyc } from "../../api";

export default function KYCUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("kycDoc", file);
    const res = await uploadKyc(formData);
    setMsg(res.data.message || "KYC uploaded");
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Upload KYC Documents</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-sky-600 text-white px-4 py-2 rounded w-full"
      >
        Upload
      </button>
      {msg && <p className="text-green-600">{msg}</p>}
    </div>
  );
}
