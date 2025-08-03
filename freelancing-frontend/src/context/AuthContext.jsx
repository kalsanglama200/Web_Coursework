import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

// Fallback user data for testing when backend is not available
const FALLBACK_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    password: "admin123"
  },
  {
    id: 2,
    name: "Client User",
    email: "client@example.com",
    role: "Client",
    password: "client123"
  },
  {
    id: 3,
    name: "Freelancer User",
    email: "freelancer@example.com",
    role: "Freelancer",
    password: "freelancer123"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Test backend availability
  const testBackend = async () => {
    try {
      await authAPI.login({ email: "test@test.com", password: "test" });
      setBackendAvailable(true);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('Backend not available, using fallback login');
        setBackendAvailable(false);
      }
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  const login = async (credentials) => {
    console.log('=== FRONTEND LOGIN START ===');
    console.log('Login credentials:', { email: credentials.email, password: '***' });
    console.log('Backend available:', backendAvailable);
    setLoading(true);
    
    try {
      if (backendAvailable) {
        // Try backend first
        console.log('Making API call to login...');
        const response = await authAPI.login(credentials);
        console.log('API response received:', response.data);
        
        const { token: newToken, user: userData } = response.data;
        
        console.log('Setting token and user...');
        setToken(newToken);
        setUser(userData);
        
        console.log('Login successful, returning success');
        console.log('=== FRONTEND LOGIN END ===');
        return { success: true };
      } else {
        // Fallback to local login
        console.log('Using fallback login system...');
        const fallbackUser = FALLBACK_USERS.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (fallbackUser) {
          const { password, ...userData } = fallbackUser;
          const fallbackToken = `fallback_token_${userData.id}_${Date.now()}`;
          
          console.log('Fallback login successful:', userData);
          setToken(fallbackToken);
          setUser(userData);
          
          console.log('=== FRONTEND LOGIN END ===');
          return { success: true, message: 'Logged in with fallback system' };
        } else {
          console.log('Fallback login failed: Invalid credentials');
          console.log('=== FRONTEND LOGIN END ===');
          return { success: false, message: 'Invalid email or password' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      // If backend fails, try fallback
      if (backendAvailable && (error.code === 'ERR_NETWORK' || error.response?.status >= 500)) {
        console.log('Backend failed, trying fallback login...');
        setBackendAvailable(false);
        
        const fallbackUser = FALLBACK_USERS.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (fallbackUser) {
          const { password, ...userData } = fallbackUser;
          const fallbackToken = `fallback_token_${userData.id}_${Date.now()}`;
          
          console.log('Fallback login successful:', userData);
          setToken(fallbackToken);
          setUser(userData);
          
          console.log('=== FRONTEND LOGIN END ===');
          return { success: true, message: 'Logged in with fallback system (backend unavailable)' };
        }
      }
      
      const message = error.response?.data?.message || "Login failed";
      console.log('Returning error:', message);
      console.log('=== FRONTEND LOGIN END ===');
      return { success: false, message };
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      if (backendAvailable) {
        const response = await authAPI.register(userData);
        return { success: true, message: response.data.message };
      } else {
        // Fallback registration
        const newUser = {
          id: FALLBACK_USERS.length + 1,
          ...userData,
          role: userData.role || 'Client'
        };
        FALLBACK_USERS.push(newUser);
        return { success: true, message: 'Registration successful (offline mode)' };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      getUserRole,
      backendAvailable
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}