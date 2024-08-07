// components/Sidebar.js
import React, { useState, useEffect } from 'react';

const Sidebar = ({ onNewChat, onChatSelect, history, onReadLater }) => {
  const [readLater, setReadLater] = useState([]);

  // Load "Read Later" chats from local storage on component mount
  useEffect(() => {
    const savedReadLater = JSON.parse(localStorage.getItem('readLater')) || [];
    setReadLater(savedReadLater);
  }, []);

  // Save "Read Later" chats to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('readLater', JSON.stringify(readLater));
  }, [readLater]);

  const handleReadLater = (chatId) => {
    if (!readLater.includes(chatId)) {
      setReadLater([...readLater, chatId]);
    }
  };

  const handleRemoveReadLater = (chatId) => {
    setReadLater(readLater.filter(id => id !== chatId));
  };

  return (
    <div className="sidebar">
      <button onClick={onNewChat} className="new-chat-button">
        New Chat
      </button>
      <div className="chat-history">
        <h3>Chat History</h3>
        <ul>
          {history.map(chat => (
            <li key={chat.id}>
              <button onClick={() => onChatSelect(chat.id)}>
                Chat from {new Date(chat.id).toLocaleString()}
              </button>
              <button onClick={() => handleReadLater(chat.id)} className="read-later-button">
                Read Later
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="read-later-list">
        <h3>Read Later</h3>
        <ul>
          {readLater.map(chatId => {
            const chat = history.find(c => c.id === chatId);
            return chat ? (
              <li key={chatId}>
                <button onClick={() => onChatSelect(chatId)}>
                  Chat from {new Date(chatId).toLocaleString()}
                </button>
                <button onClick={() => handleRemoveReadLater(chatId)} className="remove-read-later-button">
                  Remove
                </button>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
