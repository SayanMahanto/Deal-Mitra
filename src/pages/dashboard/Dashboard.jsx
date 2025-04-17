import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const envVars = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  };

  let client = null;
  if (envVars.VITE_APPWRITE_URL && envVars.VITE_APPWRITE_PROJECT_ID) {
    client = new Client()
      .setEndpoint(envVars.VITE_APPWRITE_URL)
      .setProject(envVars.VITE_APPWRITE_PROJECT_ID);
  } else {
    console.error("Missing required environment variables:", envVars);
  }

  const account = client ? new Account(client) : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!account) return;

      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data. Please log in again.");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!account) return;
    try {
      console.log("Logout successful for user:", user.email);
      await account.deleteSession("current");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-lg text-gray-700 mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
