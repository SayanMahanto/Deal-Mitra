import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) {
      setError(
        "Appwrite client is not initialized. Check environment variables."
      );
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Logging in with:", { email, password });
      await account.createEmailPasswordSession(email, password);
      console.log("Login successful for:", { email });
      navigate("/searchPage");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      if (err.message.includes("invalid credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message.includes("Rate limit")) {
        setError("Rate limit exceeded. Please try again after a few minutes.");
        setTimeout(() => setError(""), 5000);
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={handleSignup}
          >
            Sign up
          </a>
        </p>
        {error && (
          <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
