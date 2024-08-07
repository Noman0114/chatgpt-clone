// components/Chat.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import Sidebar from './Sidebar'; // Import Sidebar component

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editInput, setEditInput] = useState('');

  // Load chat history from local storage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setHistory(savedHistory);
    if (savedHistory.length > 0) {
      const latestChat = savedHistory[savedHistory.length - 1];
      setMessages(latestChat.messages);
      setCurrentChatId(latestChat.id);
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  }, [history]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Send user message to the backend
      const response = await axios.post('/api/chat', {
        messages: updatedMessages,
      });

      // Receive and set bot message
      const botMessage = { role: 'bot', content: response.data.generated_text };
      setMessages([...updatedMessages, botMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat = { id: newChatId, messages: [] };
    setMessages([]);
    setCurrentChatId(newChatId);
    setHistory([...history, newChat]);
    localStorage.setItem('chatHistory', JSON.stringify([...history, newChat]));
  };

  const handleChatSelect = (chatId) => {
    const selectedChat = history.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentChatId(chatId);
    }
  };

  const handleEditMessage = (index) => {
    setEditingMessage(index);
    setEditInput(messages[index].content);
  };

  const handleSaveEdit = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].content = editInput;
    setMessages(updatedMessages);
    setEditingMessage(null);
    localStorage.setItem('chatHistory', JSON.stringify(history.map(chat => {
      if (chat.id === currentChatId) {
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    })));
  };

  useEffect(() => {
    // Apply the theme class to the body element
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <div className="chat-wrapper">
      <Sidebar 
        onNewChat={handleNewChat} 
        onChatSelect={handleChatSelect} 
        history={history}
      />
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <Message role={msg.role} content={msg.content} />
              {editingMessage === index ? (
                <div className="edit-area">
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(index)}>Save</button>
                  <button onClick={() => setEditingMessage(null)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => handleEditMessage(index)} className="edit-button">
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={toggleDarkMode} style={{ marginLeft: '8px' }}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;