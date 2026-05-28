import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, Sparkles, User, RotateCcw, ArrowRight, Loader } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Onyx, Wendell's digital 3D Design Assistant. Ask me anything about Wendell's spatial visualizations, 3D asset downloads, project timelines, or how we construct real-time WebGL solutions."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setError(null);

    const updatedMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Endpoint is server-side proxy
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Unable to establish remote dialogue stream. Our high-fidelity portal is currently executing maintenance; you can contact us directly at info@wendellocampo.com!");
      }

      if (!res.ok) {
        throw new Error(data.message || `HTTP Error ${res.status}`);
      }

      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        throw new Error(data.message || "Failed to establish dialogue stream.");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err?.message || "Dialogue connection timed out.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "System connection interrupted. Please ensure your GEMINI_API_KEY is configured in Settings > Secrets. You can also reach our main communications conduit at info@wendellocampo.com."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Dialogue matrix reinitialized. Ask me anything about Wendell Ocampo's custom high-fidelity 3D visualization capabilities!"
      }
    ]);
    setError(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="chatbot-container">
      {/* Floating Action Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-black shadow-xl shadow-white/5 cursor-pointer border border-white/20 select-none relative group h-[48px] w-[48px] md:h-[56px] md:w-[56px]"
            title="Ask Onyx - AI Assistant"
            id="chatbot-trigger-btn"
          >
            {/* Ambient Pulse Ripple */}
            <span className="absolute inset-x-0 inset-y-0 rounded-full bg-white/10 animate-ping pointer-events-none" />
            <MessageSquare className="size-6 text-black" />
            
            {/* Micro Hover Label */}
            <span className="absolute right-16 scale-0 group-hover:scale-100 bg-neutral-900 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md duration-200 origin-right pointer-events-none whitespace-nowrap shadow-xl">
              Dialogue HUD
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Frame Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[calc(100vw-32px)] sm:w-[400px] h-[550px] rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/80"
            id="chatbot-window-panel"
          >
            {/* Elegant Metallic Header HUD */}
            <div className="px-5 py-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                  <Bot className="size-4.5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                    Onyx Assistant
                    <Sparkles className="size-3 text-[#00FAFF]" />
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">CONVERSATIONAL HUD</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                  title="Reset Dialogue History"
                  id="chatbot-reset-btn"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Terminal"
                  id="chatbot-close-btn"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Response Stream Display Area */}
            <div 
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-radial from-neutral-950 to-black select-text"
              id="chatbot-messages-container"
            >
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Role Icon */}
                    <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border ${
                      isAssistant 
                        ? "bg-white/5 border-white/10 text-neutral-300" 
                        : "bg-white text-black border-transparent"
                    }`}>
                      {isAssistant ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                    </div>

                    {/* Dialog Balloon */}
                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      isAssistant 
                        ? "bg-white/[0.03] border border-white/5 text-neutral-300 rounded-tl-none font-sans" 
                        : "bg-white text-black font-mono font-medium rounded-tr-none"
                    }`}>
                      {/* Formatted Markdown/Simple break line support */}
                      <span className="whitespace-pre-wrap select-text">
                        {msg.content}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-7 h-7 rounded-lg border bg-white/5 border-white/10 text-neutral-300 flex items-center justify-center animate-spin">
                    <Loader className="size-3.5" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/[0.02] border border-white/5 text-neutral-500 font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                    Querying Model...
                  </div>
                </div>
              )}

              {/* Error overlay alert */}
              {error && (
                <div className="p-3 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 font-mono text-[10px] text-center select-none">
                  CONNECTION INTERRUPTION: {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggested Questions */}
            <div className="px-4 py-2 border-t border-white/5 bg-black flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              {[
                "Who is Wendell?",
                "How to contact him?",
                "Where are 3D files?",
                "What skills does he have?"
              ].map((query, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInput(query);
                  }}
                  className="px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/5 text-neutral-400 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer shrink-0"
                  id={`chatbot-suggestion-${idx}`}
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Sticky Dialogue Input Bar Container */}
            <form 
              onSubmit={handleSend}
              className="p-4 bg-white/[0.01] border-t border-white/5 flex gap-2"
              id="chatbot-input-form"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Onyx a question..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all"
                disabled={isLoading}
                id="chatbot-text-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-white/5"
                id="chatbot-submit-btn"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
