import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io('http://localhost:5000'); // Replace with your backend server URL

const CollaborativeTextEditor = () => {
  const [text, setText] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [isTyping, setIsTyping] = useState(false); // To handle typing status

  // Handle text changes
  const handleTextChange = (e) => {
    const updatedText = e.target.value;
    setText(updatedText);

    // Emit text changes to the backend
    socket.emit('text-change', updatedText); // Send updated text to the backend
    setIsTyping(true);

    // After 2 seconds, stop the typing indicator
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Listen for updates from the backend
  useEffect(() => {
    // When the text is updated by another user, update the local text state
    socket.on('text-update', (newText) => {
      setText(newText); // Update the text content
    });

    // Listen for the active users list
    socket.on('active-users', (users) => {
      setActiveUsers(users); // Update active users list
    });

    // Send the username to the backend when the component mounts
    if (username) {
      socket.emit('new-user', username); // Emit the username when the user connects
    }

    // Cleanup the event listeners when the component is unmounted
    return () => {
      socket.off('text-update');
      socket.off('active-users');
    };
  }, [username]);

  // Handle submitting username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmitUsername = () => {
    if (username.trim() === '') {
      alert('Please enter a username');
      return;
    }
    // Emit username to backend
    socket.emit('new-user', username);
  };

  return (
    <div className="editor-container">
      <h2>Real-Time Collaborative Text Editor</h2>

      {/* Username Input */}
      {!username && (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <button onClick={handleSubmitUsername}>Submit</button>
        </div>
      )}

      {/* Active Users List */}
      <div>
        <h3>Active Users</h3>
        <ul>
          {activeUsers.length > 0 ? (
            activeUsers.map((user, index) => <li key={index}>{user}</li>)
          ) : (
            <li>No active users</li>
          )}
        </ul>
      </div>

      {/* Text Editor */}
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing..."
        rows="10"
        cols="50"
      />

      {/* Typing Indicator */}
      {isTyping && <div>Someone is typing...</div>}
    </div>
  );
};

export default CollaborativeTextEditor;
