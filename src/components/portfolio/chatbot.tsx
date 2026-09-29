"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Mail,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Square,
  Bot,
  User,
} from "lucide-react";
import { projects, profile, type Project } from "@/lib/projects";

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
};

// Comprehensive website knowledge base and intellectual query matching
function generateIntellectualAnswer(input: string): string {
  const query = input.toLowerCase().trim();

  // 1. Qatar OOH Project
  if (
    query.includes("qatar") ||
    query.includes("ooh") ||
    query.includes("billboard") ||
    query.includes("totem")
  ) {
    return (
      "Qatar OOH is our flagship 2026 Out-Of-Home campaign for The Entertainer across Qatar. " +
      "It features large-format roadside digital billboards installed on prominent high-traffic towers in Doha, " +
      "paired with on-site live demo photography, alongside a 3-part urban digital totem network. " +
      "The creative pairs high-velocity kinetic typography with punchy messaging like 'Save With The Best App' and 'Live More, Pay Less', " +
      "engineered for instant readability from moving highway traffic and busy pedestrian walkways."
    );
  }

  // 2. FIFA / World Cup 2026 Project
  if (
    query.includes("fifa") ||
    query.includes("world cup") ||
    query.includes("worldcup") ||
    query.includes("tournament") ||
    query.includes("ksa carousel") ||
    query.includes("qatar carousel")
  ) {
    return (
      "For the World Cup 2026 campaign, the client is The Entertainer! " +
      "Morshed crafted high-octane tournament motion graphics, including the 4-slide Carousel KSA motion series, " +
      "the 4-slide Carousel Qatar motion series, and electrifying match-day stadium frames. " +
      "The motion language is rhythm-driven, pairing team colors with rapid kinetic type to ignite fan celebration across mobile feeds."
    );
  }

  // 3. Celebrating 25 Years Project
  if (
    query.includes("25 year") ||
    query.includes("celebrating 25") ||
    query.includes("anniversary")
  ) {
    return (
      "Celebrating 25 Years is a milestone brand campaign film created for The Entertainer. " +
      "It commemorates a quarter-century of savings and lifestyle experiences with refined typography, " +
      "golden celebratory accents, and an uplifting editorial cadence that honors the brand's heritage across the Middle East."
    );
  }

  // 4. Staycation Escapes Project
  if (
    query.includes("staycation") ||
    query.includes("hotel") ||
    query.includes("escape") ||
    query.includes("summer getaway")
  ) {
    return (
      "Staycation Escapes is a vibrant summer travel campaign for The Entertainer. " +
      "It blends 3D device mockups with sun-drenched poolside cinematography, swift kinetic typography, " +
      "and dynamic promotional cuts showcasing premium hotel and resort getaways across the UAE."
    );
  }

  // 5. Ramadan 2026 Project
  if (
    query.includes("ramadan") ||
    query.includes("crescent") ||
    query.includes("lantern") ||
    query.includes("spiritual")
  ) {
    return (
      "Ramadan 2026 is a seasonal cinematic campaign for The Entertainer. " +
      "It features custom 3D crescent moon animations, warm ambient lantern light, and a contemplative narrative tempo " +
      "designed to reflect the spiritual warmth, generosity, and family gatherings of the holy month."
    );
  }

  // 6. Multiple Single Task Project
  if (
    query.includes("multiple single task") ||
    query.includes("single task") ||
    query.includes("modular")
  ) {
    return (
      "Multiple Single Task is a modular social media motion series designed for The Entertainer. " +
      "It uses tight typographic loops, micro-animations, and high-contrast color blocks engineered to hook user attention " +
      "within the first two seconds on Instagram and TikTok feeds."
    );
  }

  // 7. ONE Heart Project
  if (
    query.includes("one heart") ||
    query.includes("humanitarian") ||
    query.includes("cause")
  ) {
    return (
      "ONE Heart is an emotional humanitarian awareness campaign created for The Entertainer. " +
      "It features minimalist heart kinetic motion and tender, observational pacing that leads with empathy, " +
      "quiet transitions, and warm human storytelling."
    );
  }

  // 8. Share the Love Project
  if (
    query.includes("share the love") ||
    query.includes("valentine") ||
    query.includes("gifting")
  ) {
    return (
      "Share the Love is a playful Valentine's and seasonal gifting campaign film for The Entertainer. " +
      "It combines joyful character animations, blooming heart shapes, and upbeat kinetic typography " +
      "to celebrate shared experiences and dining savings with loved ones."
    );
  }

  // 9. Client for projects / Entertainer
  if (
    query.includes("client") ||
    query.includes("who is the client") ||
    query.includes("entertainer")
  ) {
    return (
      "Morshed is currently designing on-site at ENTERTAINER FZ LLC in Dubai! " +
      "His key campaigns for The Entertainer include Celebrating 25 Years, Staycation Escapes, Ramadan 2026, " +
      "Share the Love, Multiple Single Task, ONE Heart, World Cup 2026, and Qatar OOH."
    );
  }

  // 10. Tools & Software / AI
  if (
    query.includes("tool") ||
    query.includes("software") ||
    query.includes("after effect") ||
    query.includes("cinema 4d") ||
    query.includes("c4d") ||
    query.includes("premiere") ||
    query.includes("ai") ||
    query.includes("runway") ||
    query.includes("veo") ||
    query.includes("higgsfield")
  ) {
    return (
      "Morshed works with industry-leading post-production software: Adobe After Effects, Cinema 4D (for 3D motion), " +
      "Premiere Pro, DaVinci Resolve (color & sound), Figma, Photoshop, and Illustrator. " +
      "He also integrates modern generative AI tools into creative pipelines, including Runway Gen-3, Google Flow, " +
      "Higgsfield, Adobe Firefly, and Claude for conceptual exploration and rapid visual prototyping."
    );
  }

  // 11. 3D Animation capability
  if (query.includes("3d") || query.includes("three d") || query.includes("render")) {
    return (
      "Yes, Morshed creates custom 3D motion design using Cinema 4D and After Effects! " +
      "Notable examples include the 3D crescent moon and lantern environments in 'Ramadan 2026', " +
      "3D device mockups in 'Staycation Escapes', and 3D kinetic typography for 'Qatar OOH'."
    );
  }

  // 12. Experience & Background
  if (
    query.includes("experience") ||
    query.includes("background") ||
    query.includes("career") ||
    query.includes("how long") ||
    query.includes("resume") ||
    query.includes("cv")
  ) {
    return (
      "Morshed has over 4 years of professional motion graphics and post-production experience. " +
      "He has been working on-site at ENTERTAINER FZ LLC in Dubai since February 2024. " +
      "Previously, he was Motion Graphics Designer at DigiZone Media (2022–2023) and led motion projects for Union Church. " +
      "For his official CV or portfolio deck, you can reach out via info@themorshedalam.com."
    );
  }

  // 13. Location & Availability / Freelance
  if (
    query.includes("where") ||
    query.includes("location") ||
    query.includes("dubai") ||
    query.includes("uae") ||
    query.includes("freelance") ||
    query.includes("hire") ||
    query.includes("available") ||
    query.includes("collaborat")
  ) {
    return (
      "Morshed is based in Dubai, United Arab Emirates. He is available for select freelance collaborations, " +
      "brand commercial films, OOH displays, and motion graphics direction both locally in the UAE and with international brands remotely."
    );
  }

  // 14. Rates / Pricing / Quotes
  if (
    query.includes("rate") ||
    query.includes("price") ||
    query.includes("cost") ||
    query.includes("charge") ||
    query.includes("budget") ||
    query.includes("quote")
  ) {
    return (
      "Project pricing is tailored to the project's scope, deliverables, resolution requirements (e.g. 4K, OOH billboards, vertical ads), " +
      "and turnaround timeline. Send your project brief to info@themorshedalam.com to receive a custom quote within 24 hours."
    );
  }

  // 15. Contact info
  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("reach") ||
    query.includes("linkedin") ||
    query.includes("behance")
  ) {
    return (
      "You can contact Morshed directly at info@themorshedalam.com. " +
      "You can also connect on LinkedIn at linkedin.com/in/themorshedalam and view his curated showcases on Behance at behance.net/themorshedalam."
    );
  }

  // 16. Philosophy & Craft
  if (
    query.includes("philosophy") ||
    query.includes("style") ||
    query.includes("approach") ||
    query.includes("quote")
  ) {
    return (
      "Morshed's design philosophy centers on craft, restraint, and deliberate kinetic rhythm: " +
      "'Motion design and film for brands that take craft seriously.' " +
      "He believes typography must breathe and transitions should honor the subject rather than distract."
    );
  }

  // 17. Greetings
  if (
    query.startsWith("hi") ||
    query.startsWith("hello") ||
    query.startsWith("hey") ||
    query.includes("salam") ||
    query === "yo"
  ) {
    return (
      "Hello! I'm Morshed's AI portfolio voice assistant. You can speak to me or type your question. " +
      "Ask me anything about his 8 campaigns, 3D motion work, tools, or how to collaborate!"
    );
  }

  // 18. Gratitude
  if (query.includes("thank") || query.includes("great") || query.includes("awesome")) {
    return "You're very welcome! Feel free to ask more about any project or tap the microphone to chat further.";
  }

  // Default intelligent synthesis
  return (
    `Morshed Alam is an Animator & Motion Graphics Designer based in Dubai at ENTERTAINER FZ LLC. ` +
    `He specializes in commercial films, 3D motion, large-format OOH screens (like Qatar OOH), ` +
    `sports campaigns (World Cup 2026), and AI-augmented creative pipelines. ` +
    `Feel free to ask about any specific project, software, or send your brief to info@themorshedalam.com.`
  );
}

const quickQuestions = [
  "Tell me about Qatar OOH",
  "Who is the client for FIFA / World Cup?",
  "What 3D & AI tools do you use?",
  "Are you available for freelance in Dubai?",
];

// Clean text for natural speech synthesis
function cleanTextForVoice(raw: string): string {
  return raw
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "link on this site")
    .replace(/—/g, ", ")
    .replace(/•/g, "")
    .replace(/[#_~`]/g, "")
    .trim();
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "bot",
      content:
        "Hi! I'm Morshed's voice assistant. You can chat by text or tap the microphone to talk with me. Ask me anything about his campaigns, 3D motion, or availability.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listeningInterim, setListeningInterim] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition & Synthesis support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = "speechSynthesis" in window;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      setSpeechSupported(hasSpeech && !!SpeechRecognition);

      if (hasSpeech) {
        // Pre-load available voices
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, listeningInterim]);

  // Stop speaking helper
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingId(null);
    }
  }, []);

  // Text-To-Speech with human-like, warm inflection (Whisper/GPT voice style)
  const speakText = useCallback(
    (text: string, msgId?: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      stopSpeaking();

      const clean = cleanTextForVoice(text);
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      // Conversational pacing and natural inflection
      utterance.rate = 0.98;
      utterance.pitch = 1.02;

      // Select top-tier natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel") ||
              v.name.includes("Karen") ||
              v.name.includes("Arthur") ||
              v.name.includes("Oliver") ||
              v.name.includes("Serena"))
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (msgId) setSpeakingId(msgId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [stopSpeaking]
  );

  // Send message and trigger intelligent answer
  const handleSend = useCallback(
    (userText?: string, fromVoice = false) => {
      const message = (userText || input).trim();
      if (!message) return;

      stopSpeaking();

      const userMsgId = "user-" + Date.now();
      const botMsgId = "bot-" + (Date.now() + 1);

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: message },
      ]);
      setInput("");
      setListeningInterim("");
      setIsTyping(true);

      // Brief human typing delay for realistic interaction
      setTimeout(() => {
        const answer = generateIntellectualAnswer(message);
        setMessages((prev) => [
          ...prev,
          { id: botMsgId, role: "bot", content: answer },
        ]);
        setIsTyping(false);

        // Auto-speak answer if user asked by voice or autoSpeak is enabled
        if (autoSpeak || fromVoice) {
          speakText(answer, botMsgId);
        }
      }, 700 + Math.random() * 400);
    },
    [input, autoSpeak, speakText, stopSpeaking]
  );

  // Speech-To-Text (Microphone) handler
  const startListening = () => {
    if (typeof window === "undefined") return;

    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setListeningInterim("Listening... speak now");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setListeningInterim(transcript);
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setListeningInterim("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setListeningInterim("");
        if (input.trim()) {
          handleSend(input.trim(), true);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setIsListening(false);
      setListeningInterim("");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <>
      {/* Floating Chat & Voice Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            data-cursor="link"
            className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl hover:scale-105 transition-transform border border-[var(--rule)]"
            aria-label="Ask Me Anything & Voice Chat"
          >
            <img
              src="/projects/chatbot-heart.gif"
              alt="Ask Me Anything"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            {/* Live voice pulse indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 items-center justify-center text-[8px] text-white">
                <Mic className="h-2.5 w-2.5" />
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 25 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-[82vh] max-h-[600px] w-[calc(100vw-2rem)] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream)] shadow-2xl backdrop-blur-md"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-[var(--rule)] bg-foreground px-4 py-3.5 text-[var(--cream)]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-foreground">
                  <span className="font-mono-display text-[13px] font-bold tracking-tight">
                    MA
                  </span>
                  {isSpeaking && (
                    <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
                  )}
                </div>
                <div>
                  <div className="font-mono-display flex items-center gap-2 text-[14px] font-medium leading-tight">
                    <span>Ask Me Anything</span>
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono uppercase text-emerald-300">
                      Voice AI
                    </span>
                  </div>
                  <div className="font-mono-label flex items-center gap-2 text-[10px] text-[var(--cream)]/70 mt-0.5">
                    {isSpeaking ? (
                      <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                        <span className="flex items-center gap-0.5">
                          <span className="h-2 w-0.5 animate-pulse bg-emerald-300" />
                          <span className="h-3 w-0.5 animate-pulse bg-emerald-300 [animation-delay:0.15s]" />
                          <span className="h-2 w-0.5 animate-pulse bg-emerald-300 [animation-delay:0.3s]" />
                        </span>
                        Speaking answer...
                      </span>
                    ) : isListening ? (
                      <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                        Listening to you...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online • Ready to chat & talk
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Controls: Voice Toggle & Close */}
              <div className="flex items-center gap-1.5">
                {/* Voice Auto-Speak Toggle */}
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setAutoSpeak(!autoSpeak);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    autoSpeak
                      ? "text-emerald-300 hover:bg-white/10"
                      : "text-[var(--cream)]/40 hover:bg-white/10"
                  }`}
                  title={autoSpeak ? "Voice is ON (click to mute)" : "Voice is OFF (click to unmute)"}
                  aria-label="Toggle voice output"
                >
                  {autoSpeak ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>

                {/* Stop speech if currently speaking */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                    title="Stop speaking"
                    aria-label="Stop speaking"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeaking();
                    stopListening();
                    setIsOpen(false);
                  }}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-white/10 transition-colors ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="scroll-cream flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[var(--cream)]">
              {messages.map((msg) => {
                const isBot = msg.role === "bot";
                const isCurrentSpeaking = isSpeaking && speakingId === msg.id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[88%]">
                      {isBot && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cream-soft)] border border-[var(--rule)] text-[10px] text-foreground font-mono">
                          MA
                        </div>
                      )}

                      <div
                        className={`group relative rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                          !isBot
                            ? "bg-foreground text-[var(--cream)] rounded-br-sm shadow-sm"
                            : "bg-[var(--cream-soft)] border border-[var(--rule)] text-foreground rounded-bl-sm"
                        } ${isCurrentSpeaking ? "ring-2 ring-emerald-500/40" : ""}`}
                      >
                        {msg.content}

                        {/* Bot Voice Replay Button */}
                        {isBot && (
                          <div className="mt-2 pt-1.5 border-t border-[var(--rule)]/60 flex items-center justify-between gap-2 text-[10px] text-[var(--meta)]">
                            <button
                              onClick={() => {
                                if (isCurrentSpeaking) {
                                  stopSpeaking();
                                } else {
                                  speakText(msg.content, msg.id);
                                }
                              }}
                              className="font-mono flex items-center gap-1.5 hover:text-foreground transition-colors py-0.5"
                              title="Listen to this answer"
                            >
                              {isCurrentSpeaking ? (
                                <>
                                  <Square className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Stop audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3 w-3" />
                                  <span>Listen voice</span>
                                </>
                              )}
                            </button>

                            {isCurrentSpeaking && (
                              <div className="flex items-center gap-0.5">
                                <span className="h-2 w-0.5 bg-emerald-500 animate-pulse" />
                                <span className="h-3.5 w-0.5 bg-emerald-500 animate-pulse [animation-delay:0.1s]" />
                                <span className="h-2 w-0.5 bg-emerald-500 animate-pulse [animation-delay:0.2s]" />
                                <span className="h-4 w-0.5 bg-emerald-500 animate-pulse [animation-delay:0.3s]" />
                                <span className="h-2.5 w-0.5 bg-emerald-500 animate-pulse [animation-delay:0.15s]" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Live Listening Feedback Banner */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-amber-300/60 bg-amber-50/80 dark:bg-amber-950/20 px-3.5 py-2.5 text-[12px] text-amber-800 dark:text-amber-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="font-mono text-[11px] font-medium">
                      {listeningInterim || "Listening... speak now"}
                    </span>
                  </div>
                  <button
                    onClick={stopListening}
                    className="text-[11px] font-mono text-amber-700 dark:text-amber-300 underline underline-offset-2"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-center gap-2"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cream-soft)] border border-[var(--rule)] text-[10px] text-foreground font-mono">
                    MA
                  </div>
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-[var(--rule)] bg-[var(--cream-soft)] px-3.5 py-2.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
                  </div>
                </motion.div>
              )}

              {/* Quick Questions Pills */}
              {messages.length <= 2 && !isTyping && (
                <div className="space-y-1.5 pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--meta)] px-1">
                    Suggested questions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="font-mono-label rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-3 py-1.5 text-[11px] text-foreground/80 transition-all hover:border-foreground hover:bg-foreground hover:text-[var(--cream)]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct Email Link */}
            {messages.length > 2 && (
              <div className="border-t border-[var(--rule)]/60 bg-[var(--cream-soft)]/50 px-4 py-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono-label flex items-center justify-center gap-2 text-[11px] text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Have a specific brief? Email Morshed directly
                </a>
              </div>
            )}

            {/* Input Bar with Voice (Mic) & Send */}
            <div className="border-t border-[var(--rule)] bg-[var(--cream)] p-3">
              <div className="flex items-center gap-2">
                {/* Voice Input (Microphone) Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    isListening
                      ? "bg-rose-500 text-white ring-4 ring-rose-300/40 animate-pulse"
                      : "border border-[var(--rule)] bg-[var(--cream-soft)] text-foreground hover:bg-foreground hover:text-[var(--cream)]"
                  }`}
                  title={isListening ? "Listening... click to send" : "Tap to speak with voice"}
                  aria-label={isListening ? "Stop listening" : "Start speaking"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                {/* Text input */}
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
                  placeholder={
                    isListening ? "Listening to your voice..." : "Type or speak question..."
                  }
                  className="font-mono-label flex-1 rounded-full border border-[var(--rule)] bg-[var(--cream-soft)] px-4 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[var(--cream)] transition-all hover:opacity-85 disabled:opacity-25"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
