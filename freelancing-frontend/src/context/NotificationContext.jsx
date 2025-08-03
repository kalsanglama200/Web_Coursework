import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

let id = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "info", duration = 3500) => {
    const notification = { id: ++id, message, type };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, duration);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
} 