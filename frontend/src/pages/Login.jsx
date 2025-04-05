import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { UserContext } from "../App";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Ensure user data structure matches expectations
        const userData = {
          id: data.id,
          email: data.email,
          username: data.username,
          avatar: data.avatar,
          isPremium: data.isPremium || false
        };

        // Clear previous session flags
        sessionStorage.removeItem("loginShown");
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Delay navigation slightly to ensure popup state updates
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        setError(data.detail || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <Gamepad2 className="mx-auto h-12 w-12 text-purple-500 animate-bounce" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to Ascend
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Level up your life, one habit at a time
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center p-3 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">🌀</span>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <div className="text-center">
            <a
              href="/signup"
              className="text-purple-500 hover:text-purple-400 transition-colors duration-200 text-sm"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;