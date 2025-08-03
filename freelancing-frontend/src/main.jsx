import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// If you have these context files, import them:
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { UsersProvider } from "./context/UsersContext";
import { JobsProvider } from "./context/JobsContext";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import { ChatProvider } from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UsersProvider>
            <JobsProvider>
              <NotificationProvider>
                <ChatProvider>
                  <Notification />
                  <App />
                </ChatProvider>
              </NotificationProvider>
            </JobsProvider>
          </UsersProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);