import { useState, useEffect, useRef } from "react";

export default function AIAssistant({ onClose, userRole }) {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🐸 ¡Hola! I'm Coquito, your Coqui POS training assistant! I can help you learn how to use the system, teach customer service tips, and share strategies for success. What would you like to know?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    const currentMessage = userMessage;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: "user", content: currentMessage }
    ];
    setMessages(newMessages);
    setUserMessage("");
    setIsLoading(true);

    // Call backend API to get Coquito's response
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          userRole: userRole || 'Employee'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.response
          }
        ]);
      } else {
        // Fallback if backend fails
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "🐸 Sorry, I'm having trouble connecting to my knowledge base. Try asking: 'How do I process a payment?' or 'What are good customer service tips?'"
          }
        ]);
      }
    } catch (error) {
      console.error('Coquito API Error:', error);
      // Fallback response
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "🐸 Oops! I'm having connection issues. Make sure the backend server is running. In the meantime, ask me about: payments, kitchen tickets, manager features, or customer service!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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
          <h2>🐸 Coquito - POS Training Assistant</h2>
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
              <div className="message-avatar">
                {message.role === "assistant" ? "🐸" : "👤"}
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message assistant">
              <div className="message-avatar">🐸</div>
              <div className="message-content loading">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                Coquito is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-assistant-input">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Coquito about payments, customer service, manager features..."
            rows="3"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="send-btn"
            disabled={isLoading || !userMessage.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
