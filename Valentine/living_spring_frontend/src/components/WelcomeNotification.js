import React, { useEffect, useState } from 'react';

const WelcomeNotification = ({ username }) => {
  const [message, setMessage] = useState('');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/api/global-message/${username}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.message && !data.is_read) {
          setMessage(data.message);
          setShowBanner(true);
        }
      });
  }, [username]);

  const markAsRead = () => {
    fetch('http://localhost:5000/api/mark-global-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, message }),
    }).then(() => setShowBanner(false));
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.message}>
        <strong>📩 New Message:</strong> {message}
      </div>
      <button style={styles.button} onClick={markAsRead}>Mark as Read</button>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '12px 20px',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    margin: '20px auto',
    maxWidth: '600px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    marginRight: '20px',
  },
  button: {
    backgroundColor: '#ffd966',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '6px',
  }
};

export default WelcomeNotification;
