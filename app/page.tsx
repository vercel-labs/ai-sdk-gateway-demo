"use client";

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "bg-gray-50 dark:bg-gray-800/30"
            }`}
          >
            <strong>{message.role === "user" ? "User: " : "AI: "}</strong>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-4">
        <div className="flex gap-2">
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            className="flex-1 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
