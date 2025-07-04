import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";

const Chatbot = () => {
  const api =import.meta.env.VITE_API_dish;
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
          api,
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
            text: "Sorry, I couldn't process your request. Please try again.(API token not accepted)",
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
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold my-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-4 my-2" {...props} />
              ),
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              p: ({ node, ...props }) => <p className="my-2" {...props} />,
              strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
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
              : "bottom-24 right-24  w-[400px] h-[480px]"
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
                <div className="flex space-x-2">
                  <img
                    src="./loading.gif"
                    alt=""
                    srcset=""
                    width="60px"
                    height="20px"
                  />
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
