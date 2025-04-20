import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
      setError("Appwrite client is not initialized. Check environment variables.");
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
      await account.createEmailPasswordSession(email, password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/searchPage");
      setEmail("");
      setPassword("");
    } catch (err) {
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

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className={`flex flex-col md:flex-row min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Dark Mode Toggle */}
      <button
        className="absolute top-4 right-4 bg-gradient-to-r from-yellow-300 to-green-300 text-white px-3 py-2 rounded-full text-sm shadow-md hover:brightness-110 flex items-center gap-2"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Left Side */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-6 tracking-wide">DEAL MITRA</h1>
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-opacity-80 mb-6">Please enter your details</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-yellow-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-yellow-500"
              />
              Remember for 30 days
            </label>
            <a href="#" className="text-sm text-green-600 hover:underline">
              Forgot password
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-green-400 text-white font-semibold py-2 rounded-md hover:brightness-110 transition-all shadow-md"
          >
            {isSubmitting ? "Signing In..." : "Sign in"}
          </button>

          <div className="mt-4">
            <button
              type="button"
              className="w-full border border-gray-300 flex items-center justify-center py-2 rounded-md text-sm hover:bg-yellow-100 text-gray-800 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
              Sign in with Google
            </button>
          </div>

          <p className="text-center text-sm mt-6">
            Don't have an account?{' '}
            <a href="#" onClick={handleSignup} className="text-green-600 hover:underline">
              Sign up
            </a>
          </p>
          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </form>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex w-full md:w-1/2 bg-[#D8CFF2] dark:bg-gray-800 items-center justify-center animate-fade-in">
        <img
          src="/YellowGreen.png"
          alt="YellowGreen Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
