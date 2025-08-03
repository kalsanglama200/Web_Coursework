import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";

const ChatWindow = ({ jobId, onClose, participants }) => {
  const { chats, sendMessage } = useChat();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const messages = chats[jobId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(jobId, user.name, input.trim());
      setInput("");
    }
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <span>Chat for Job #{jobId}</span>
        <button onClick={onClose} className="chat-close">&times;</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === user.name ? "own" : ""}`}
          >
            <div className="chat-meta">
              <b>{msg.sender}</b> <span>{msg.timestamp}</span>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow; 