import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Camera, User, Mail, Lock } from "lucide-react";
import { UserContext } from "../App";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar:
      "https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?auto=format&fit=crop&w=150&h=150",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully!");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <Gamepad2 className="mx-auto h-12 w-12 text-purple-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Join Ascend</h2>
          <p className="mt-2 text-sm text-gray-400">
            Begin your journey to greatness
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center">{success}</div>
          )}

          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={formData.avatar}
                className="w-24 h-24 rounded-full border-4 border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Create Account
          </button>

          <div className="text-center">
            <a href="/" className="text-purple-500 hover:text-purple-400">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
