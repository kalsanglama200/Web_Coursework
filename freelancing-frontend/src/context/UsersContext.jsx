import React, { createContext, useContext, useState, useEffect } from "react";
import { userAPI } from "../services/api";

const UsersContext = createContext();

// Fallback user data for testing when backend is not available
const FALLBACK_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    banned: false,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Client User",
    email: "client@example.com",
    role: "Client",
    banned: false,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: 3,
    name: "Freelancer User",
    email: "freelancer@example.com",
    role: "Freelancer",
    banned: false,
    created_at: "2024-01-03T00:00:00Z"
  }
];

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Test backend availability
  const testBackend = async () => {
    try {
      await userAPI.getAllUsers();
      setBackendAvailable(true);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('Backend not available, using fallback users');
        setBackendAvailable(false);
        setUsers(FALLBACK_USERS);
      }
    }
  };

  // Load users from API or fallback
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await userAPI.getAllUsers();
        setUsers(response.data);
      } else {
        setUsers(FALLBACK_USERS);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        console.log('Backend failed, using fallback users');
        setBackendAvailable(false);
        setUsers(FALLBACK_USERS);
      } else {
        setError(err.response?.data?.message || 'Failed to load users');
        console.error('Error loading users:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  useEffect(() => {
    if (backendAvailable !== null) {
      loadUsers();
    }
  }, [backendAvailable]);

  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await userAPI.deleteUser(userId);
        await loadUsers();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: remove user locally
        setUsers(users.filter(user => user.id !== userId));
        return { success: true, message: 'User deleted (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        setUsers(users.filter(user => user.id !== userId));
        return { success: true, message: 'User deleted (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to delete user';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await userAPI.toggleUserBan(userId);
        await loadUsers();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: toggle ban locally
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, banned: !user.banned }
            : user
        );
        setUsers(updatedUsers);
        return { success: true, message: 'User ban status updated (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, banned: !user.banned }
            : user
        );
        setUsers(updatedUsers);
        return { success: true, message: 'User ban status updated (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to toggle user ban status';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ 
      users, 
      loading, 
      error, 
      deleteUser, 
      toggleBan,
      loadUsers,
      backendAvailable
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}