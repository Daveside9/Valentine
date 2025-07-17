// src/components/UserChat.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Change to your backend URL

const UserChat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('user_receive', (data) => {
      setChat((prev) => [...prev, { sender: 'Admin', text: data.message }]);
    });

    return () => {
      socket.off('user_receive');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('user_message', { message });
      setChat((prev) => [...prev, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, maxWidth: 400 }}>
      <h3>User Chat</h3>
      <div style={{ height: 150, overflowY: 'auto', marginBottom: 10 }}>
        {chat.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default UserChat;
