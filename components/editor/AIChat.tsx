"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Loader2, User, RefreshCw, Lock, Zap } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert technical interviewer at a top product company like Google, Microsoft, or Amazon. You are conducting a mock coding interview to help a student prepare for placements.

Your behavior:
- The candidate will choose between Mock Interview mode or Practice mode
- In Mock Interview mode: act strict like a real interviewer, ask one problem, evaluate their approach, ask follow-up questions on complexity and edge cases
- In Practice mode: be friendly, let them pick topic/difficulty, give hints when asked
- Always ask what their target company is to tailor the difficulty
- Keep responses concise and conversational (2-4 sentences max unless giving a problem)
- If they want a new problem, give them one`;

const INITIAL_MESSAGE =
  "Hey! Ready to ace your placement interviews?\n\nI can help you in two ways:\n1. Mock Interview — I'll act as a real interviewer, ask you problems, and evaluate your answers\n2. Practice Mode — Pick a topic and difficulty, and we'll solve problems together with hints\n\nWhich one would you like? And what's your target company — product (Google/Microsoft/Amazon) or service (TCS/Infosys/Wipro)?";

interface Props {
  isPro?: boolean;
}

export default function AIChat({ isPro = false }: Props) {
  const storageKey = `ai-chat-${typeof window !== "undefined" ? window.location.pathname : "default"}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [{ role: "assistant", content: INITIAL_MESSAGE }];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [{ role: "assistant", content: INITIAL_MESSAGE }];
    } catch {
      return [{ role: "assistant", content: INITIAL_MESSAGE }];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist messages to localStorage on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", messages: newMessages, systemPrompt: SYSTEM_PROMPT }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.result || "Sorry, I had trouble responding. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
    setMessages([{ role: "assistant", content: INITIAL_MESSAGE }]);
    setInput("");
  };

  // Locked state for free users
  if (!isPro) {
    return (
      <div className="flex flex-col h-full bg-[#0e0e10] items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-[#1e1b4b] rounded-xl flex items-center justify-center mb-3">
          <Bot className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="w-7 h-7 bg-[#18181b] border border-[#27272a] rounded-full flex items-center justify-center -mt-4 ml-8 mb-4">
          <Lock className="w-3.5 h-3.5 text-[#52525b]" />
        </div>
        <h3 className="text-[#fafafa] font-medium text-sm mb-1.5">AI Interviewer</h3>
        <p className="text-[#52525b] text-xs leading-relaxed mb-5 max-w-[180px]">
          Practice mock interviews with AI. Available on the Pro plan.
        </p>
        <Link href="/#pricing">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 text-xs h-8 px-3 rounded-lg transition-all duration-150">
            <Zap className="w-3 h-3" />
            Upgrade to Pro
          </Button>
        </Link>
        <p className="text-[#3f3f46] text-xs mt-3">₹299/month · Cancel anytime</p>
      </div>
    );
  }

  // Full chat for Pro users
  return (
    <div className="flex flex-col h-full bg-[#0e0e10]">

      {/* Header */}
      <div className="h-9 border-b border-[#27272a] flex items-center px-4 justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[#71717a] text-xs font-medium">AI Interviewer</span>
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        </div>
        <button
          onClick={resetChat}
          className="text-[#3f3f46] hover:text-[#71717a] transition-colors"
          title="New interview"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-[#1e1b4b]" : "bg-[#0c4a6e]"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="w-2.5 h-2.5 text-indigo-400" />
                : <User className="w-2.5 h-2.5 text-cyan-400" />
              }
            </div>
            <div className={`max-w-[82%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === "assistant"
                ? "bg-[#18181b] text-[#a1a1aa] rounded-tl-sm border border-[#27272a]"
                : "bg-indigo-600 text-white rounded-tr-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full bg-[#1e1b4b] flex items-center justify-center flex-shrink-0">
              <Bot className="w-2.5 h-2.5 text-indigo-400" />
            </div>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl rounded-tl-sm px-3 py-2">
              <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#27272a] flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#fafafa] placeholder:text-[#3f3f46] focus:outline-none focus:border-indigo-500 transition-colors duration-150"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 rounded-lg h-8 transition-all duration-150"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>

    </div>
  );
}
