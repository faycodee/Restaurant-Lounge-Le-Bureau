import React, { useState } from "react";
import { Bot, X, Send } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! Tell me what you like and I will suggest the right dish for you !",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      setInput("");
      // Add bot response logic here
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thanks for your message! I'll help you with that.",
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      <div
        style={{ position: "fixed", right: 50, top: "77vh", zIndex: 220 }}
        className="flex items-center justify-center  
 -7 bg-transparent"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open chat"
          className="p-2 rounded-full shadow-md 
          transition-transform transform hover:scale-110
          text-black  dark:text-white "

        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-24 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold dark:text-white">
                Chat Assistant
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 dark:text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none"
                      : "bg-primary text-white rounded-tr-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
