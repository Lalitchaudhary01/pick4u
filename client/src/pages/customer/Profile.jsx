import React, { useEffect, useState } from "react";
import { getProfile } from "../../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setUser(res.data));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
