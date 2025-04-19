import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account, ID } from "appwrite";
import { Eye, EyeOff } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatarSeed, setAvatarSeed] = useState("");
  const [activeTab, setActiveTab] = useState("profileDetails");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    website: "",
    facebook: "",
    twitter: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const envVars = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  };

  let client = null;
  if (envVars.VITE_APPWRITE_URL && envVars.VITE_APPWRITE_PROJECT_ID) {
    client = new Client()
      .setEndpoint(envVars.VITE_APPWRITE_URL)
      .setProject(envVars.VITE_APPWRITE_PROJECT_ID);
  }

  const account = client ? new Account(client) : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!account) return;
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        setFormData({
          email: currentUser.email || "",
          firstName: currentUser.name?.split(" ")[0] || "",
          lastName: currentUser.name?.split(" ")[1] || "",
          website: "https://profilepress.net",
          facebook: "https://www.facebook.com/profilepress",
          twitter: "https://twitter.com/profilepress",
        });

        const storedSeed = localStorage.getItem("avatarSeed");
        const seed = storedSeed || Math.random().toString(36).substring(2, 10);
        setAvatarSeed(seed);
        if (!storedSeed) localStorage.setItem("avatarSeed", seed);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = async () => {
    if (!account) return;
    try {
      await account.deleteSession("current");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out.");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated!");
    console.log("Updated data:", formData);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert("Password changed!");
    console.log("Change Password:", passwordData);
  };

  const renderMainContent = () => {
    if (activeTab === "profileDetails") {
      return (
        <div className="flex gap-10 flex-wrap">
          {/* Left: Profile Details */}
          <div className="w-full md:w-[350px] bg-white shadow-md p-6 rounded-xl">
            <img
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}`}
              alt="Avatar"
              className="w-28 h-28 mx-auto rounded-full border-4 border-blue-500 mb-4"
            />
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {["firstName", "lastName", "email", "website", "facebook", "twitter"].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
              </button>
            </form>
          </div>

          {/* Right: Account Actions */}
          <div className="w-full md:flex-1 bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              {showChangePassword ? "Hide Change Password" : "Change Password"}
            </button>

            {showChangePassword && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="relative">
                    <label className="block font-medium mb-1">Old Password</label>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-9"
                    >
                      {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block font-medium mb-1">New Password</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <img
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}`}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 mb-4"
        />
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("profileDetails")}
            className={`w-full text-left px-4 py-2 rounded ${activeTab === "profileDetails" ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-200 text-gray-700"}`}
          >
            My Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-gray-50">{renderMainContent()}</main>
    </div>
  );
};

export default Dashboard;
