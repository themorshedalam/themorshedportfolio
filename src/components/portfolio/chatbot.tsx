"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail } from "lucide-react";
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
      "I specialize in Motion Graphics Design, 2D/3D Animation, Video Editing, and Commercial Direction. My work spans large-format Out-Of-Home (OOH) digital billboards, Meta Ads, social campaigns, campaign films, In-App graphics, and Paid Media — using tools like After Effects, Cinema 4D, Premiere Pro, DaVinci Resolve, Runway Gen-3, and Google Flow.",
  },
  {
    question: "Where are you based?",
    answer:
      "I'm based in Dubai, UAE, working on-site at ENTERTAINER FZ LLC as a Graphic & Motion Graphics Designer. I'm open to collaborations across the UAE and remotely worldwide.",
  },
  {
    question: "What's your experience?",
    answer:
      "I have over 4 years of professional motion design and post-production experience. Currently at the ENTERTAINER (Feb 2024 – Present), previously at DigiZone Media (Aug 2022 – Dec 2023), and freelance motion work with Union Church. I specialize in commercial films, launch campaigns, and seasonal narratives.",
  },
  {
    question: "What tools do you use?",
    answer:
      "Motion: After Effects, Cinema 4D (3D animation), Frame by Frame, Type in Motion. Video & Post: Premiere Pro, DaVinci Resolve (color grading & sound design). AI Tools: Google Flow, Runway Gen-3, Higgsfield, Adobe Firefly, Claude. Design: Photoshop, Illustrator, InDesign, Figma, Canva.",
  },
  {
    question: "Tell me about Qatar OOH",
    answer:
      "Qatar OOH is our 2026 Out-Of-Home campaign for The Entertainer across Qatar. It features large-format digital billboards installed on prominent roadside building towers in Doha (with live on-site installation photos on this portfolio) and a 3-part urban street totem network with kinetic typography: 'Save With The Best App' and 'Live More, Pay Less'.",
  },
  {
    question: "What did you do for World Cup 2026?",
    answer:
      "For the World Cup 2026 project, the client is The Entertainer! I created high-energy sports tournament animations, including the 4-slide Carousel KSA motion series, the 4-slide Carousel Qatar motion series, and electrifying match-day stadium frames engineered for fan engagement.",
  },
  {
    question: "Tell me about Celebrating 25 Years",
    answer:
      "Celebrating 25 Years is a milestone brand campaign film created for The Entertainer, celebrating a quarter-century of lifestyle savings with golden celebratory lighting, refined kinetic typography, and an uplifting editorial cadence.",
  },
  {
    question: "Tell me about Ramadan 2026",
    answer:
      "Ramadan 2026 is a cinematic seasonal campaign for The Entertainer featuring custom 3D crescent moon animations, warm ambient lantern light, and a contemplative tempo reflecting spiritual warmth and generosity.",
  },
  {
    question: "Tell me about Staycation Escapes",
    answer:
      "Staycation Escapes is a summer getaway travel campaign for The Entertainer, combining 3D device mockups with poolside visuals and energetic typography to showcase luxury hotel and resort savings.",
  },
  {
    question: "Do you do 3D animation?",
    answer:
      "Yes! I create custom 3D motion design using Cinema 4D and After Effects. You can see my 3D work in the Ramadan 2026 crescent scenes, Staycation device renders, and Qatar OOH billboard mockups.",
  },
  {
    question: "Are you available for freelance?",
    answer:
      "Yes! I'm open to select freelance collaborations on campaign films, 3D motion, and OOH displays. If you have a brief or an upcoming launch, reach out to me at info@themorshedalam.com.",
  },
  {
    question: "How can I contact you?",
    answer:
      "The fastest way is email: info@themorshedalam.com. You can also find me on Behance (behance.net/themorshedalam) and LinkedIn (linkedin.com/in/themorshedalam). For project inquiries, feel free to use the Contact page on this site.",
  },
  {
    question: "What are your rates?",
    answer:
      "Pricing depends on the scope, deliverables, resolution requirements (4K, OOH screens, vertical ads), and timeline. For a custom quote, please email your brief to info@themorshedalam.com, and I'll get back to you within 24 hours.",
  },
];

const quickReplies = [
  "What services do you offer?",
  "Tell me about Qatar OOH",
  "What did you do for World Cup 2026?",
  "Are you available for freelance?",
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();

  // Qatar OOH
  if (lower.includes("qatar") || lower.includes("ooh") || lower.includes("billboard") || lower.includes("totem")) {
    return knowledgeBase[4].answer;
  }

  // World Cup 2026 / FIFA
  if (lower.includes("world cup") || lower.includes("fifa") || lower.includes("worldcup") || lower.includes("ksa") || (lower.includes("entertainer") && lower.includes("cup"))) {
    return knowledgeBase[5].answer;
  }

  // 25 Years
  if (lower.includes("25 year") || lower.includes("celebrat") || lower.includes("anniversary")) {
    return knowledgeBase[6].answer;
  }

  // Ramadan
  if (lower.includes("ramadan") || lower.includes("crescent") || lower.includes("lantern")) {
    return knowledgeBase[7].answer;
  }

  // Staycation
  if (lower.includes("staycation") || lower.includes("hotel") || lower.includes("summer")) {
    return knowledgeBase[8].answer;
  }

  // Multiple Single Task
  if (lower.includes("multiple single task") || lower.includes("single task") || lower.includes("modular")) {
    return "Multiple Single Task is a modular social media motion series designed for The Entertainer. It uses tight typographic loops and micro-animations engineered to capture viewer attention on Instagram and TikTok feeds.";
  }

  // ONE Heart
  if (lower.includes("one heart") || lower.includes("humanitarian") || lower.includes("cause")) {
    return "ONE Heart is an emotional humanitarian awareness campaign created for The Entertainer, using gentle heart motion and warm observational storytelling that leads with empathy.";
  }

  // Share the Love
  if (lower.includes("share the love") || lower.includes("valentine") || lower.includes("gifting")) {
    return "Share the Love is a playful Valentine's and seasonal gifting campaign film for The Entertainer, packed with cheerful character animation and blooming heart shapes.";
  }

  // 3D
  if (lower.includes("3d") || lower.includes("three d") || lower.includes("cinema 4d") || lower.includes("c4d")) {
    return knowledgeBase[9].answer;
  }

  // Client
  if (lower.includes("client") || lower.includes("who is the client") || lower.includes("entertainer")) {
    return "Morshed is currently working on-site at ENTERTAINER FZ LLC in Dubai! His key campaigns for The Entertainer include Celebrating 25 Years, Staycation Escapes, Ramadan 2026, Share the Love, Multiple Single Task, ONE Heart, World Cup 2026, and Qatar OOH.";
  }

  // Keywords
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
      match: ["tool", "software", "use", "program", "app", "after effect", "runway", "premiere", "ai", "flow"],
      answer: knowledgeBase[3].answer,
    },
    {
      match: ["freelance", "available", "hire", "work with", "collaborate", "open"],
      answer: knowledgeBase[10].answer,
    },
    {
      match: ["contact", "email", "reach", "message", "connect", "social", "linkedin", "behance"],
      answer: knowledgeBase[11].answer,
    },
    {
      match: ["rate", "price", "cost", "charge", "fee", "budget", "quote"],
      answer: knowledgeBase[12].answer,
    },
    {
      match: ["hello", "hi", "hey", "salam", "greetings"],
      answer:
        "Hello! Thanks for visiting. I'm Morshed's portfolio assistant. Ask me anything about his work, 3D motion, Qatar billboards, World Cup 2026, or how to collaborate!",
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

  // Fallback
  return `Great question! Morshed specializes in Motion Graphics Design, 3D animation, and commercial films at ENTERTAINER FZ LLC in Dubai. For specific inquiries or a custom quote, please email him directly at info@themorshedalam.com.`;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hi! I'm Morshed's assistant. Ask me anything about his motion design, projects, experience, or availability — or try a quick question below.",
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
    }, 600 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            data-cursor="link"
            className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl hover:scale-105 transition-transform"
            aria-label="Ask me anything"
          >
            <img
              src="/projects/chatbot-heart.gif"
              alt="Ask me anything"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-5 right-5 z-50 flex h-[540px] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream)] shadow-2xl"
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
                      className="font-mono-label rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-3 py-1.5 text-[11px] text-foreground/75 transition-colors hover:border-foreground hover:bg-foreground hover:text-[var(--cream)]"
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
                className="font-mono-label flex-1 rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-4 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-foreground"
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
