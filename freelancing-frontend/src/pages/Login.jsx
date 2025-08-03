import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [testResult, setTestResult] = useState("");
  const { login, loading, backendAvailable } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      setTestResult(`✅ ${result.message || 'Login successful!'}`);
      // Don't navigate immediately to test if login works
      setTimeout(() => {
        // Redirect based on user role
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "Client") {
          navigate("/client");
        } else if (user?.role === "Freelancer") {
          navigate("/freelancer");
        } else if (user?.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000); // Wait 2 seconds before redirecting
    } else {
      setErrors({ general: result.message });
      setTestResult("❌ Login failed: " + result.message);
    }
  };

  const testLogin = async (email, password, role) => {
    setTestResult(`Testing ${role} login...`);
    const result = await login({ email, password });
    
    if (result.success) {
      setTestResult(`✅ ${role} login successful!`);
      setFormData({ email, password });
    } else {
      setTestResult(`❌ ${role} login failed: ${result.message}`);
    }
  };

  return (
    <div className="container login-register-container">
      <h2>Login</h2>
      
      {/* Backend Status */}
      <div style={{ 
        marginBottom: 20, 
        padding: 10, 
        background: backendAvailable ? '#d4edda' : '#f8d7da', 
        borderRadius: 5,
        border: `1px solid ${backendAvailable ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <h4>System Status</h4>
        <p>
          <strong>Backend:</strong> {backendAvailable ? '🟢 Connected' : '🔴 Offline (using fallback)'}
        </p>
        <p>
          <strong>Mode:</strong> {backendAvailable ? 'Online' : 'Offline Mode'}
        </p>
      </div>
      
      {/* Test Section */}
      <div style={{ marginBottom: 20, padding: 10, background: '#f0f0f0', borderRadius: 5 }}>
        <h4>Quick Test</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          <button onClick={() => testLogin("admin@example.com", "admin123", "Admin")}>
            Test Admin
          </button>
          <button onClick={() => testLogin("client@example.com", "client123", "Client")}>
            Test Client
          </button>
          <button onClick={() => testLogin("freelancer@example.com", "freelancer123", "Freelancer")}>
            Test Freelancer
          </button>
        </div>
        <div style={{ padding: 10, background: '#fff', borderRadius: 3 }}>
          <strong>Result:</strong> {testResult}
        </div>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          autoComplete="username"
          disabled={loading}
          placeholder="Enter your email"
        />
        {errors.email && <div className="form-error">{errors.email}</div>}

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
          autoComplete="current-password"
          disabled={loading}
          placeholder="Enter your password"
        />
        {errors.password && <div className="form-error">{errors.password}</div>}

        {errors.general && <div className="form-error">{errors.general}</div>}

        <button type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      {/* Debug Info */}
      <div style={{ marginTop: 20, padding: 10, background: '#e8f4fd', borderRadius: 5, fontSize: '12px' }}>
        <h4>Debug Info</h4>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Backend Available: {backendAvailable ? 'Yes' : 'No'}</p>
        <p>Form Data: {JSON.stringify({ email: formData.email, password: formData.password ? '***' : '' })}</p>
        <p>Errors: {JSON.stringify(errors)}</p>
        <p>User in localStorage: {localStorage.getItem("user") ? 'Yes' : 'No'}</p>
        <p>Token in localStorage: {localStorage.getItem("token") ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default Login;