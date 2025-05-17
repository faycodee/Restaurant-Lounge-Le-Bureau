import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! Tell me what you like and I will suggest the right dish for you!",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/chatbot/suggest",
          {
            message: userMessage,
          }
        );

        if (response.data.success) {
          setMessages((prev) => [
            ...prev,
            {
              text: response.data.suggestion,
              isBot: true,
              isMarkdown: true,
            },
          ]);
        } else {
          throw new Error("Failed to get suggestion");
        }
      } catch (error) {
        console.error("Chatbot error:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I couldn't process your request. Please try again.",
            isBot: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const MessageContent = ({ message }) => {
    if (message.isMarkdown) {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            children={message.text}
            components={{
              p: ({ children }) => <p className="mb-1">{children}</p>,
              strong: ({ children }) => (
                <span className="font-bold text-primary">{children}</span>
              ),
              em: ({ children }) => (
                <span className="italic text-gray-600 dark:text-gray-300">
                  {children}
                </span>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <span className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-sm font-mono">
                    {children}
                  </span>
                ) : (
                  <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded">
                    {children}
                  </pre>
                ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              b: ({ children }) => <b className="mb-1">{children}</b>,
              h3: ({ children }) => (
                <h3 className="font-bold text-lg mt-3 mb-2">{children}</h3>
              ),
              hr: () => (
                <hr className="my-2 border-gray-300 dark:border-gray-600" />
              ),
            }}
          />
        </div>
      );
    }
    return <span>{message.text}</span>;
  };

  return (
    <>
      <div
        style={{ position: "fixed", right: 50, top: "77vh", zIndex: 220 }}
        className="flex items-center justify-center bg-transparent"
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
        <div
          className={`fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ${
            isZoomed
              ? "top-20 right-24 left-20 bottom-20 "
              : "bottom-24 right-24 w-86 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold dark:text-white">
                Menu Assistant
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label={isZoomed ? "Minimize chat" : "Maximize chat"}
              >
                {isZoomed ? (
                  <Minimize2 className="w-5 h-5 dark:text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 dark:text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isZoomed ? "text-base" : "text-sm"
            }`}
          >
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
                  <MessageContent message={message} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="animate-bounce">⋅</div>
                    <div className="animate-bounce delay-100">⋅</div>
                    <div className="animate-bounce delay-200">⋅</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tell me what you like..."
                className={`flex-1 p-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                  isZoomed ? "text-base p-3" : "text-sm p-2"
                }`}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 ${
                  isZoomed ? "p-3" : "p-2"
                }`}
              >
                <Send className={isZoomed ? "w-6 h-6" : "w-5 h-5"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
