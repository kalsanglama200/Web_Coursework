import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const roles = [
  { value: "Freelancer", icon: "🧑‍💻", description: "Find work and projects" },
  { value: "Client", icon: "💼", description: "Post jobs and hire talent" }
];

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "Freelancer",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const { register, loading, backendAvailable } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name) newErrors.name = "Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email address";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";
    if (!form.role) newErrors.role = "Please select a role";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    });

    if (result.success) {
      setSuccess(result.message || "Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setErrors({ general: result.message });
    }
  };

  const strength = passwordStrength(form.password);
  const strengthText =
    strength === 0
      ? ""
      : strength === 1
      ? "Weak"
      : strength === 2
      ? "Fair"
      : strength === 3
      ? "Good"
      : "Strong";
  const strengthColor =
    strength === 1
      ? "#dc3545"
      : strength === 2
      ? "#ffc107"
      : strength === 3
      ? "#17a2b8"
      : strength === 4
      ? "#28a745"
      : "#ccc";

  return (
    <div className="container login-register-container">
      <h2>Register</h2>
      
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
        {!backendAvailable && (
          <p style={{ fontSize: '12px', marginTop: 5 }}>
            Note: In offline mode, registration data is stored locally and will be lost when you refresh the page.
          </p>
        )}
      </div>
      
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
          disabled={loading}
          placeholder="Enter your full name"
        />
        {errors.name && <div className="form-error">{errors.name}</div>}

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          disabled={loading}
          placeholder="Enter your email address"
        />
        {errors.email && <div className="form-error">{errors.email}</div>}

        <label>Password</label>
        <div className="password-field">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            autoComplete="new-password"
            disabled={loading}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPass((v) => !v)}
            tabIndex={-1}
            disabled={loading}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        <div className="password-strength">
          {strength > 0 && (
            <span style={{ color: strengthColor }}>
              {strengthText} password
            </span>
          )}
        </div>
        {errors.password && <div className="form-error">{errors.password}</div>}

        <label>Confirm Password</label>
        <div className="password-field">
          <input
            name="confirm"
            type={showConfirm ? "text" : "password"}
            value={form.confirm}
            onChange={handleChange}
            className={errors.confirm ? "input-error" : ""}
            autoComplete="new-password"
            disabled={loading}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
            disabled={loading}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirm && <div className="form-error">{errors.confirm}</div>}

        <label>Role</label>
        <div className="role-select">
          {roles.map((r) => (
            <label key={r.value} className="role-option">
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={form.role === r.value}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="role-icon">{r.icon}</span>
              <div className="role-info">
                <span className="role-name">{r.value}</span>
                <span className="role-description">{r.description}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.role && <div className="form-error">{errors.role}</div>}

        {errors.general && <div className="form-error">{errors.general}</div>}
        {success && <div className="form-success">{success}</div>}

        <button type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;