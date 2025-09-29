import React, { useEffect, useState } from "react";
import { getDriverProfile, updateDriverProfile } from "../../api";

export default function DriverProfile() {
  const [driver, setDriver] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getDriverProfile().then((res) => setDriver(res.data));
  }, []);

  const handleUpdate = async () => {
    const res = await updateDriverProfile(driver);
    alert(res.data.message || "Profile updated");
    setEdit(false);
  };

  if (!driver) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Driver Profile</h2>
      <input
        value={driver.name}
        disabled={!edit}
        onChange={(e) => setDriver({ ...driver, name: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <p>Email: {driver.email}</p>
      <p>Phone: {driver.phone}</p>
      <button
        onClick={() => (edit ? handleUpdate() : setEdit(true))}
        className="bg-sky-600 text-white px-4 py-2 rounded"
      >
        {edit ? "Save" : "Edit Profile"}
      </button>
    </div>
  );
}
