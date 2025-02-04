import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import gsap from "gsap";

const RestaurantChat = () => {
  const [messages, setMessages] = useState([]); // Store messages
  const [input, setInput] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const messagesEndRef = useRef(null); // Reference to the end of messages container

  // Initialize OpenAI client
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:
      "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",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": "https://your-website.com",
      "X-Title": "Restaurant Chat",
    },
  });

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return; // Ignore empty input or if already loading

    // Add user message to the list
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input immediately

    const request = `
    ${input}
    `;

    setIsLoading(true); // Start loading

    try {
      console.log("Sending request to API...");
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        max_tokens: 100,
        messages: [{ role: "user", content: request }],
      });
      console.log("API Response:", completion);

      // Add bot response to the list
      const botMessage = {
        text: completion.choices[0].message.content,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to the list
      const errorMessage = {
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Animate new messages using GSAP
  useEffect(() => {
    if (messages.length > 0) {
      gsap.from(".message", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
      });
    }
    scrollToBottom(); // Scroll to the bottom after new messages are added
  }, [messages]);

  return (
    <div className="max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg p-4 bg-white">
      {/* Messages Container */}
      <div className="h-80 overflow-y-auto mb-4 border-b border-gray-200 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message p-3 my-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
            style={{ maxWidth: "80%" }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message p-3 my-2 rounded-lg bg-gray-100 text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="اكتب رسالتك هنا..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading} // Disable input while loading
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </div>
    </div>
  );
};

export default RestaurantChat;
