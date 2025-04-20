import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account, Databases, ID } from "appwrite";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const envVars = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  };

  let client = null;
  if (envVars.VITE_APPWRITE_URL && envVars.VITE_APPWRITE_PROJECT_ID) {
    client = new Client()
      .setEndpoint(envVars.VITE_APPWRITE_URL)
      .setProject(envVars.VITE_APPWRITE_PROJECT_ID);
  } else {
    console.error("Missing required environment variables:", envVars);
  }

  const databases = client ? new Databases(client) : null;
  const account = client ? new Account(client) : null;

  const handleSignin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) {
      setError("Appwrite client is not initialized. Check environment variables.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError("");
    try {
      await account.create(ID.unique(), email, password, name);
      await databases.createDocument(
        envVars.VITE_APPWRITE_DATABASE_ID,
        envVars.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          email: email,
          password: password,
          name: name,
        }
      );
      navigate("/login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-[#fef9ec] via-[#edfce4] to-[#d0f4c5]">
      <div className="flex flex-col justify-center px-10 py-12">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-extrabold text-[#3e3e3e] mb-4">DEAL MITRA</h1>
          <h2 className="text-2xl font-semibold text-[#556b2f] mb-2">Create your account</h2>
          <p className="text-sm text-[#6b705c] mb-6">Start your journey with us</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4d4d4d]">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[#c4b998] bg-[#fff9e6] px-3 py-2 shadow focus:border-[#a3d977] focus:ring-[#a3d977]"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4d4d4d]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[#c4b998] bg-[#fff9e6] px-3 py-2 shadow focus:border-[#a3d977] focus:ring-[#a3d977]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4d4d4d]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[#c4b998] bg-[#fff9e6] px-3 py-2 shadow focus:border-[#a3d977] focus:ring-[#a3d977]"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4d4d4d]">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[#c4b998] bg-[#fff9e6] px-3 py-2 shadow focus:border-[#a3d977] focus:ring-[#a3d977]"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#fcd34d] to-[#8bc34a] text-white py-2 rounded-lg font-semibold hover:from-[#fde68a] hover:to-[#9ccc65] shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center text-[#6b705c] mt-6">
            Already have an account?{' '}
            <span
              className="text-[#5b8c42] hover:underline cursor-pointer"
              onClick={handleSignin}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      <div className="hidden md:block bg-gradient-to-br from-[#fef9ec] via-[#dff7e1] to-[#bce7b1]" />
    </div>
  );
}

export default Signup;
