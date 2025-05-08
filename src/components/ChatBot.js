import React, { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!input) return;

    const newChat = [...chat, { role: 'user', content: input }];
    setChat(newChat);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newChat,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setChat([...newChat, response.data.choices[0].message]);
    } catch (error) {
      alert('Error fetching chatbot response');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ccc' }}>
      <h3>Legal ChatBot</h3>
      <div style={{ maxHeight: 200, overflowY: 'scroll' }}>
        {chat.map((msg, idx) => (
          <p key={idx}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a legal question..."
        style={{ width: '70%', marginRight: 10 }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatBot;
