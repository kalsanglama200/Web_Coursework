import React from "react";
import { useNotification } from "../context/NotificationContext";
import "./Notification.css";

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification-${n.type}`}> 
          <span>{n.message}</span>
          <button className="notification-close" onClick={() => removeNotification(n.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};

export default Notification; 