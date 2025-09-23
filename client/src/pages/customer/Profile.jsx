import { useState, useEffect } from "react";
import API from "../../utils/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/customer/profile").then((res) => setProfile(res.data));
  }, []);

  const handleSave = async () => {
    await API.put("/customer/profile", profile);
    alert("Profile updated");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <input
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <input
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
