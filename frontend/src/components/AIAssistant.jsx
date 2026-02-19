import { useState } from "react";

export default function AIAssistant({ onClose }) {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Assistant. How can I help you today? 🤖"
    }
  ]);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(newMessages);
    setUserMessage("");

    // Placeholder for AI response (to be implemented later)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "AI functionality will be added here. This is a placeholder response."
        }
      ]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-overlay">
      <div className="ai-assistant-modal">
        {/* Header */}
        <div className="ai-assistant-header">
          <h2>🤖 AI Assistant</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="ai-assistant-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`ai-message ${message.role}`}
            >
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="ai-assistant-input">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            rows="3"
          />
          <button onClick={handleSendMessage} className="send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
