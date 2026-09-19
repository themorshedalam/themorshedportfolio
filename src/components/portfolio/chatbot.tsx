"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mail } from "lucide-react";
import { profile } from "@/lib/projects";

type Message = {
  role: "bot" | "user";
  content: string;
};

type QA = {
  question: string;
  answer: string;
};

const knowledgeBase: QA[] = [
  {
    question: "What services do you offer?",
    answer:
      "I specialize in Motion Graphics Design, Animation, Video Editing, and Graphic Design. My work spans Meta Ads, EDM campaigns, CRM visuals, In-App graphics, Push Notifications, and Paid Media — using tools like After Effects, Cinema 4D, VEO3, and Runway.",
  },
  {
    question: "Where are you based?",
    answer:
      "I'm based in Dubai, UAE, working on-site at ENTERTAINER FZ LLC as a Graphic & Motion Graphics Designer. I'm open to collaborations across the UAE and remotely.",
  },
  {
    question: "What's your experience?",
    answer:
      "I have over 4 years of professional experience. Currently at the ENTERTAINER (Feb 2024 – Present), previously at DigiZone Media (Aug 2022 – Dec 2023), and freelance motion work with Union Church. I specialize in campaign films, launch films, and seasonal narratives.",
  },
  {
    question: "What tools do you use?",
    answer:
      "Motion: After Effects, Cinema 4D, Frame by Frame, Type in Motion. AI Tools: Google Flow, Runway, Higgsfield, Firefly, Claude. Edit: Premiere Pro, DaVinci Resolve, Color, Sound Design. Design: Photoshop, Illustrator, InDesign, Figma, Canva.",
  },
  {
    question: "Are you available for freelance?",
    answer:
      "Yes! I'm open to collaborations on campaigns, launches, and seasonal films. If you have a brief — or even just a direction — I'd love to hear what you're making. Reach me at info@themorshedalam.com",
  },
  {
    question: "How can I contact you?",
    answer:
      "The fastest way is email: info@themorshedalam.com. You can also find me on Behance (behance.net/themorshedalam) and LinkedIn (linkedin.com/in/themorshedalam). For project inquiries, use the Contact page on this site.",
  },
  {
    question: "What's your latest work?",
    answer:
      "My recent projects include 'Celebrating 25 Years' for The Entertainer, 'Share the Love' campaign, 'Staycation Escapes', 'Ramadan 2026' seasonal film, 'Multiple Single Task' social series, and 'ONE Heart'. Browse the Projects page to see them all.",
  },
  {
    question: "Do you work with AI tools?",
    answer:
      "Absolutely. I integrate AI into my workflow using Google Flow, Runway, Higgsfield, Firefly, and Claude. These tools help me deliver cutting-edge creative solutions faster, while maintaining full art direction and quality control.",
  },
];

const quickReplies = [
  "What services do you offer?",
  "What's your experience?",
  "Are you available for freelance?",
  "How can I contact you?",
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();

  // Keyword matching
  const keywords: { match: string[]; answer: string }[] = [
    {
      match: ["service", "offer", "do you do", "what kind", "specialty"],
      answer: knowledgeBase[0].answer,
    },
    {
      match: ["where", "location", "based", "live", "dubai", "uae"],
      answer: knowledgeBase[1].answer,
    },
    {
      match: ["experience", "year", "how long", "background", "career", "work history"],
      answer: knowledgeBase[2].answer,
    },
    {
      match: ["tool", "software", "use", "program", "app", "after effect", "cinema 4d", "runway"],
      answer: knowledgeBase[3].answer,
    },
    {
      match: ["freelance", "available", "hire", "work with", "collaborate", "open"],
      answer: knowledgeBase[4].answer,
    },
    {
      match: ["contact", "email", "reach", "message", "connect", "social"],
      answer: knowledgeBase[5].answer,
    },
    {
      match: ["latest", "recent", "portfolio", "project", "work", "showreel", "case study"],
      answer: knowledgeBase[6].answer,
    },
    {
      match: ["ai", "artificial intelligence", "flow", "firefly", "higgsfield", "claude"],
      answer: knowledgeBase[7].answer,
    },
    {
      match: ["rate", "price", "cost", "charge", "fee", "budget"],
      answer:
        "Pricing depends on the scope and complexity of the project. For a custom quote, please email me at info@themorshedalam.com with your brief, and I'll get back to you within 24 hours.",
    },
    {
      match: ["resume", "cv", "download"],
      answer:
        "You can view my full experience on the About page of this site. For a PDF resume, please email me at info@themorshedalam.com and I'll send it over.",
    },
    {
      match: ["hello", "hi", "hey", "salam", "greetings"],
      answer:
        "Hello! Thanks for visiting. I'm Morshed's portfolio assistant. Ask me anything about his work, experience, or how to get in touch — or try one of the quick questions below.",
    },
    {
      match: ["thanks", "thank you", "cheers", "appreciate"],
      answer: "You're welcome! Feel free to explore the Projects page or reach out via email anytime.",
    },
  ];

  for (const { match, answer } of keywords) {
    if (match.some((m) => lower.includes(m))) {
      return answer;
    }
  }

  // Default fallback
  return `Great question! I don't have a specific answer for that, but Morshed would love to help. Email him at info@themorshedalam.com or check the About and Contact pages for more details.`;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hi! I'm Morshed's assistant. Ask me anything about his work, experience, or availability — or try a quick question below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const message = (text || input).trim();
    if (!message) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(message);
      setMessages((prev) => [...prev, { role: "bot", content: answer }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button — desktop only (hidden on mobile) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            data-cursor="link"
            className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-foreground text-[var(--cream)] shadow-xl hover:scale-105 transition-transform lg:flex"
            aria-label="Ask me anything"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window — desktop only (hidden on mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-5 right-5 z-50 hidden h-[520px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream)] shadow-2xl lg:flex"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--rule)] bg-foreground px-4 py-3 text-[var(--cream)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-foreground">
                  <span className="font-mono-display text-[14px] font-semibold">MA</span>
                </div>
                <div>
                  <div className="font-mono-display text-[14px] leading-tight">
                    Ask Me Anything
                  </div>
                  <div className="font-mono-label flex items-center gap-1.5 text-[10px] text-[var(--cream)]/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Online now
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="scroll-cream flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.5] ${
                      msg.role === "user"
                        ? "bg-foreground text-[var(--cream)] rounded-br-sm"
                        : "bg-[var(--cream-soft)] border border-[var(--rule)] text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-[var(--rule)] bg-[var(--cream-soft)] px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
                  </div>
                </motion.div>
              )}

              {/* Quick replies (show when few messages) */}
              {messages.length <= 2 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickReplies.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="font-mono-label rounded-full border border-[var(--rule)] px-3 py-1.5 text-[11px] text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Email button */}
            {messages.length > 2 && (
              <div className="border-t border-[var(--rule)] px-4 py-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono-label flex items-center justify-center gap-2 text-[11px] text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Or email Morshed directly
                </a>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-[var(--rule)] p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your question..."
                className="font-mono-label flex-1 rounded-full border border-[var(--rule)] bg-[var(--cream)] px-4 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-foreground"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[var(--cream)] transition-opacity hover:opacity-80 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
