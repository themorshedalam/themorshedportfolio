"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  MessageSquare,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { profile } from "@/lib/projects";

// ChatGPT-style voice personas with distinct pitch, rate, and preferred voice matchers
type VoicePersona = {
  id: "breeze" | "cove" | "ember" | "sky";
  name: string;
  tone: string;
  rate: number;
  pitch: number;
  genderFilter: "female" | "male" | "any";
};

const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "breeze",
    name: "Breeze",
    tone: "Crisp & Friendly",
    rate: 1.02,
    pitch: 1.05,
    genderFilter: "female",
  },
  {
    id: "cove",
    name: "Cove",
    tone: "Calm & Grounded",
    rate: 0.95,
    pitch: 0.92,
    genderFilter: "male",
  },
  {
    id: "ember",
    name: "Ember",
    tone: "Dynamic & Warm",
    rate: 1.0,
    pitch: 1.0,
    genderFilter: "any",
  },
  {
    id: "sky",
    name: "Sky",
    tone: "Gentle & Natural",
    rate: 0.98,
    pitch: 1.08,
    genderFilter: "female",
  },
];

// Natural, human-like conversational answers formatted specifically for spoken dialogue
function getConversationalSpokenAnswer(input: string): string {
  const query = input.toLowerCase().trim();

  // 1. Qatar OOH
  if (
    query.includes("qatar") ||
    query.includes("ooh") ||
    query.includes("billboard") ||
    query.includes("totem")
  ) {
    return (
      "Yeah, absolutely! Qatar OOH is a massive Out-Of-Home billboard campaign we did for The Entertainer in Doha. " +
      "Morshed created huge digital billboard screens for highway building towers, plus a network of pedestrian street totems with fast kinetic typography. " +
      "You can actually see the real on-site photos of the billboard screens live in Qatar right on the portfolio!"
    );
  }

  // 2. FIFA / World Cup 2026
  if (
    query.includes("fifa") ||
    query.includes("world cup") ||
    query.includes("worldcup") ||
    query.includes("tournament") ||
    query.includes("entertainer") && query.includes("cup")
  ) {
    return (
      "For the World Cup 2026 project, the client is The Entertainer! " +
      "Morshed designed high-energy sports animations, including the four-part KSA and Qatar motion carousels, and match-day motion frames with vibrant team celebration."
    );
  }

  // 3. Celebrating 25 Years
  if (
    query.includes("25") ||
    query.includes("celebrat") ||
    query.includes("anniversary")
  ) {
    return (
      "Celebrating 25 Years is a milestone brand film for The Entertainer. " +
      "It honors a quarter-century of lifestyle savings with golden celebratory lighting, refined typography, and an uplifting editorial cadence."
    );
  }

  // 4. Staycation Escapes
  if (
    query.includes("staycation") ||
    query.includes("hotel") ||
    query.includes("summer") ||
    query.includes("resort")
  ) {
    return (
      "Staycation Escapes is a summer travel campaign for The Entertainer. " +
      "It pairs 3D device mockups with poolside visuals and energetic typography to highlight luxury hotel getaways across the UAE."
    );
  }

  // 5. Ramadan 2026
  if (
    query.includes("ramadan") ||
    query.includes("crescent") ||
    query.includes("lantern") ||
    query.includes("spiritual")
  ) {
    return (
      "Ramadan 2026 is a cinematic seasonal campaign featuring custom 3D crescent moon animations, warm ambient lantern light, and a contemplative spiritual pacing."
    );
  }

  // 6. Multiple Single Task
  if (
    query.includes("multiple single task") ||
    query.includes("single task") ||
    query.includes("modular") ||
    query.includes("social")
  ) {
    return (
      "Multiple Single Task is a modular social media motion series designed for fast feeds, using rapid typographic loops and micro-animations to catch eyes on Instagram and TikTok."
    );
  }

  // 7. ONE Heart
  if (
    query.includes("one heart") ||
    query.includes("humanitarian") ||
    query.includes("cause") ||
    query.includes("heart")
  ) {
    return (
      "ONE Heart is an emotional humanitarian awareness campaign created for The Entertainer. It uses gentle heart motion and warm, observational storytelling that leads with empathy."
    );
  }

  // 8. Share the Love
  if (
    query.includes("share the love") ||
    query.includes("valentine") ||
    query.includes("love") ||
    query.includes("gifting")
  ) {
    return (
      "Share the Love is a playful Valentine's and seasonal gifting campaign for The Entertainer, packed with cheerful character animation and blooming heart shapes."
    );
  }

  // 9. 3D Animation Work
  if (query.includes("3d") || query.includes("three d") || query.includes("cinema 4d") || query.includes("c4d")) {
    return (
      "Yes! Morshed does custom 3D motion design using Cinema 4D and After Effects. You can see his 3D work in the Ramadan crescent scenes, the Staycation device renders, and the Qatar billboards."
    );
  }

  // 10. Tools & AI Pipeline
  if (
    query.includes("tool") ||
    query.includes("software") ||
    query.includes("after effects") ||
    query.includes("premiere") ||
    query.includes("ai") ||
    query.includes("runway")
  ) {
    return (
      "His core creative stack is After Effects, Cinema 4D, Premiere Pro, and DaVinci Resolve. He also integrates generative AI tools like Runway Gen-3, Google Flow, and Higgsfield for rapid visual prototyping."
    );
  }

  // 11. Background, Experience & Dubai
  if (
    query.includes("who is morshed") ||
    query.includes("tell me about yourself") ||
    query.includes("experience") ||
    query.includes("background") ||
    query.includes("where") ||
    query.includes("dubai") ||
    query.includes("uae")
  ) {
    return (
      "Morshed is a motion graphics designer and video editor with over four years of experience. He's based in Dubai, working on-site at The Entertainer since February 2024, and previously worked at DigiZone Media."
    );
  }

  // 12. Freelance Availability, Rates & Hiring
  if (
    query.includes("hire") ||
    query.includes("freelance") ||
    query.includes("available") ||
    query.includes("work with") ||
    query.includes("rate") ||
    query.includes("cost") ||
    query.includes("quote")
  ) {
    return (
      "He's open for select freelance collaborations on brand films, 3D motion, and campaigns! Just drop him an email with your project brief at info@themorshedalam.com, and he'll get back to you within twenty-four hours."
    );
  }

  // 13. Contact Info
  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("reach") ||
    query.includes("linkedin") ||
    query.includes("behance")
  ) {
    return (
      "You can reach Morshed directly at info@themorshedalam.com, or check out his LinkedIn and Behance profiles linked right on this site."
    );
  }

  // 14. Greetings & Small Talk
  if (
    query.startsWith("hi") ||
    query.startsWith("hello") ||
    query.startsWith("hey") ||
    query.includes("salam") ||
    query === "yo" ||
    query.includes("how are you")
  ) {
    return (
      "Hey! I'm doing great, thanks for asking. What would you like to explore? We can talk about his 3D animations, the Qatar billboards, or his work at The Entertainer."
    );
  }

  if (query.includes("thank") || query.includes("great") || query.includes("cool") || query.includes("awesome")) {
    return "You're very welcome! Feel free to ask anything else whenever you're ready.";
  }

  // Default fallback conversational reply
  return (
    "Morshed is a motion graphics designer and 3D animator in Dubai at The Entertainer. " +
    "He specializes in commercial campaign films, large-format OOH billboards, and social animation. " +
    "What specific project or tool would you like to talk about?"
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [activePersona, setActivePersona] = useState<VoicePersona>(VOICE_PERSONAS[0]); // Default "Breeze"
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [botTranscript, setBotTranscript] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);

  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const isSpeakingRef = useRef(false);
  const isComponentMounted = useRef(true);

  // Load available system voices
  useEffect(() => {
    isComponentMounted.current = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      isComponentMounted.current = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speaking helper
  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  }, []);

  // Find best natural voice for chosen persona
  const getPersonaVoice = useCallback(
    (persona: VoicePersona): SpeechSynthesisVoice | null => {
      const allVoices = voicesRef.current.length > 0
        ? voicesRef.current
        : typeof window !== "undefined" && "speechSynthesis" in window
        ? window.speechSynthesis.getVoices()
        : [];

      if (!allVoices.length) return null;

      const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));

      // 1. Natural / Neural premium voices
      const naturalVoices = englishVoices.filter(
        (v) =>
          v.name.includes("Natural") ||
          v.name.includes("Enhanced") ||
          v.name.includes("Premium") ||
          v.name.includes("Google")
      );

      // Match persona preference
      if (persona.id === "breeze") {
        const found = naturalVoices.find(
          (v) =>
            v.name.includes("Jenny") ||
            v.name.includes("Samantha") ||
            v.name.includes("Serena") ||
            v.name.includes("Aria") ||
            v.name.includes("Google UK English Female")
        );
        if (found) return found;
      } else if (persona.id === "cove") {
        const found = naturalVoices.find(
          (v) =>
            v.name.includes("Guy") ||
            v.name.includes("Ryan") ||
            v.name.includes("Daniel") ||
            v.name.includes("Oliver") ||
            v.name.includes("Google UK English Male")
        );
        if (found) return found;
      } else if (persona.id === "ember") {
        const found = naturalVoices.find(
          (v) =>
            v.name.includes("Ava") ||
            v.name.includes("Arthur") ||
            v.name.includes("Google US English")
        );
        if (found) return found;
      } else if (persona.id === "sky") {
        const found = naturalVoices.find(
          (v) =>
            v.name.includes("Karen") ||
            v.name.includes("Zoe") ||
            v.name.includes("Sonia")
        );
        if (found) return found;
      }

      // Fallbacks
      return naturalVoices[0] || englishVoices[0] || allVoices[0] || null;
    },
    []
  );

  // Text-To-Speech (Bot Speaks directly to user)
  const speakDirectly = useCallback(
    (text: string, onFinish?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      stopSpeech();
      setVoiceState("speaking");
      isSpeakingRef.current = true;
      setBotTranscript(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = activePersona.rate;
      utterance.pitch = activePersona.pitch;

      const selectedVoice = getPersonaVoice(activePersona);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (onFinish) {
          onFinish();
        } else {
          // Continuous Voice Loop: Automatically start listening for the user's next spoken input!
          startListeningLoop();
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error", e);
        isSpeakingRef.current = false;
        startListeningLoop();
      };

      window.speechSynthesis.speak(utterance);
    },
    [activePersona, getPersonaVoice, stopSpeech]
  );

  // Speech-To-Text (Continuous User Voice Input)
  const startListeningLoop = useCallback(() => {
    if (typeof window === "undefined" || isMicMuted) {
      setVoiceState("idle");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState("idle");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setVoiceState("listening");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setVoiceState("idle");
        }
      };

      recognition.onend = () => {
        // If user said something, answer it intellectually
        if (userTranscript.trim()) {
          const finalQuery = userTranscript.trim();
          setUserTranscript("");
          setTranscriptHistory((prev) => [...prev, { role: "user", text: finalQuery }]);

          setVoiceState("thinking");

          // Brief natural processing pause
          setTimeout(() => {
            const answer = getConversationalSpokenAnswer(finalQuery);
            setTranscriptHistory((prev) => [...prev, { role: "bot", text: answer }]);
            speakDirectly(answer);
          }, 450);
        } else {
          // If no speech detected yet, stay in listening state or return to idle
          if (!isSpeakingRef.current && !isMicMuted && isOpen) {
            // Keep listening
            try {
              recognition.start();
            } catch (_) {
              setVoiceState("idle");
            }
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setVoiceState("idle");
    }
  }, [isMicMuted, userTranscript, isOpen, speakDirectly]);

  // Open Voice Mode: Greet user with warm human voice directly
  const handleOpenVoiceMode = () => {
    setIsOpen(true);
    setIsMicMuted(false);
    setUserTranscript("");
    setBotTranscript("");

    // Initial warm conversational voice greeting (exactly like ChatGPT Voice Mode)
    setTimeout(() => {
      const greeting =
        "Hey! I'm Morshed's voice assistant. We can talk about his 3D motion, Qatar billboards, or his work at The Entertainer. What's on your mind?";
      setBotTranscript(greeting);
      setTranscriptHistory([{ role: "bot", text: greeting }]);
      speakDirectly(greeting);
    }, 400);
  };

  // Close Voice Mode
  const handleCloseVoiceMode = () => {
    stopSpeech();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
    setVoiceState("idle");
    setIsOpen(false);
  };

  // User taps the orb to interrupt or speak
  const handleOrbClick = () => {
    if (voiceState === "speaking") {
      // Interrupt bot speaking immediately!
      stopSpeech();
      startListeningLoop();
    } else if (voiceState === "listening") {
      // User tapped while listening -> finalize or stop
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Idle -> start listening
      startListeningLoop();
    }
  };

  // Toggle Mute
  const toggleMicMute = () => {
    if (!isMicMuted) {
      // Muting
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      setIsMicMuted(true);
      if (voiceState === "listening") {
        setVoiceState("idle");
      }
    } else {
      // Unmuting
      setIsMicMuted(false);
      startListeningLoop();
    }
  };

  return (
    <>
      {/* Floating Entry Button with Voice Waves */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpenVoiceMode}
            data-cursor="link"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-foreground px-4 py-2.5 text-[var(--cream)] shadow-2xl hover:scale-105 transition-all border border-white/10 group backdrop-blur-md"
            aria-label="Start Voice Bot"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 overflow-hidden">
              <img
                src="/projects/chatbot-heart.gif"
                alt="Voice Assistant"
                width={40}
                height={40}
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping opacity-75" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-mono-display text-[13px] font-semibold tracking-tight text-white flex items-center gap-1.5">
                <span>Talk with Voice</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="font-mono text-[10px] text-white/60">
                Direct voice • No typing
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ChatGPT Voice Bot Modal (Pure Voice Interface) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative flex h-full max-h-[720px] w-full max-w-[480px] flex-col items-center justify-between rounded-3xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl overflow-hidden"
            >
              {/* Background ambient voice glow */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
                  voiceState === "speaking"
                    ? "opacity-40"
                    : voiceState === "listening"
                    ? "opacity-30"
                    : "opacity-15"
                }`}
                style={{
                  background:
                    voiceState === "speaking"
                      ? "radial-gradient(circle at center, rgba(16, 185, 129, 0.25) 0%, transparent 70%)"
                      : voiceState === "listening"
                      ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.25) 0%, transparent 70%)"
                      : "radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
                }}
              />

              {/* Top Bar: Title & Voice Persona Picker */}
              <div className="relative z-10 flex w-full items-center justify-between">
                {/* Voice Persona Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-mono text-white/90 hover:bg-white/10 transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                    <span>Voice: {activePersona.name}</span>
                    <ChevronDown className="h-3 w-3 text-white/50" />
                  </button>

                  <AnimatePresence>
                    {showPersonaMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 mt-2 w-48 rounded-2xl border border-white/15 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-20"
                      >
                        {VOICE_PERSONAS.map((persona) => (
                          <button
                            key={persona.id}
                            onClick={() => {
                              setActivePersona(persona);
                              setShowPersonaMenu(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-mono transition-colors ${
                              activePersona.id === persona.id
                                ? "bg-white/15 text-emerald-400 font-semibold"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>{persona.name}</span>
                            <span className="text-[10px] text-white/40">{persona.tone}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleCloseVoiceMode}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                  aria-label="Close Voice Chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Center: The Iconic ChatGPT Voice Orb */}
              <div className="relative z-10 flex flex-1 flex-col items-center justify-center my-auto w-full">
                {/* Clickable Orb container */}
                <button
                  onClick={handleOrbClick}
                  className="group relative flex items-center justify-center outline-none cursor-pointer"
                  aria-label="Voice Orb. Tap to speak or interrupt"
                  title="Tap to speak or interrupt"
                >
                  {/* Outer Ripple Wave 1 */}
                  <motion.div
                    animate={
                      voiceState === "speaking"
                        ? {
                            scale: [1, 1.45, 1],
                            opacity: [0.35, 0.05, 0.35],
                          }
                        : voiceState === "listening"
                        ? {
                            scale: [1, 1.25, 1],
                            opacity: [0.4, 0.15, 0.4],
                          }
                        : {
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.08, 0.2],
                          }
                    }
                    transition={{
                      duration: voiceState === "speaking" ? 1.4 : 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute h-64 w-64 rounded-full ${
                      voiceState === "speaking"
                        ? "bg-emerald-500/25 blur-2xl"
                        : voiceState === "listening"
                        ? "bg-blue-500/25 blur-2xl"
                        : "bg-purple-500/15 blur-2xl"
                    }`}
                  />

                  {/* Outer Ripple Wave 2 */}
                  <motion.div
                    animate={
                      voiceState === "speaking"
                        ? {
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.15, 0.5],
                          }
                        : voiceState === "listening"
                        ? {
                            scale: [1, 1.18, 1],
                            opacity: [0.5, 0.25, 0.5],
                          }
                        : {
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.15, 0.3],
                          }
                    }
                    transition={{
                      duration: voiceState === "speaking" ? 1.1 : 2.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    className={`absolute h-52 w-52 rounded-full ${
                      voiceState === "speaking"
                        ? "bg-teal-400/30 blur-xl"
                        : voiceState === "listening"
                        ? "bg-cyan-400/30 blur-xl"
                        : "bg-indigo-400/20 blur-xl"
                    }`}
                  />

                  {/* Core ChatGPT Fluid Voice Orb */}
                  <motion.div
                    animate={
                      voiceState === "speaking"
                        ? {
                            scale: [1, 1.15, 0.95, 1.08, 1],
                            rotate: [0, 90, 180, 270, 360],
                            borderRadius: [
                              "50% 50% 50% 50%",
                              "45% 55% 50% 50%",
                              "55% 45% 55% 45%",
                              "50% 50% 45% 55%",
                              "50% 50% 50% 50%",
                            ],
                          }
                        : voiceState === "listening"
                        ? {
                            scale: [1, 1.08, 1],
                            borderRadius: [
                              "50% 50% 50% 50%",
                              "48% 52% 52% 48%",
                              "50% 50% 50% 50%",
                            ],
                          }
                        : voiceState === "thinking"
                        ? {
                            scale: [0.95, 1.05, 0.95],
                            rotate: [0, 360],
                          }
                        : {
                            scale: [1, 1.03, 1],
                          }
                    }
                    transition={{
                      duration:
                        voiceState === "speaking"
                          ? 2.2
                          : voiceState === "thinking"
                          ? 1.5
                          : 3.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center shadow-2xl transition-all ${
                      voiceState === "speaking"
                        ? "bg-gradient-to-tr from-emerald-400 via-teal-200 to-cyan-400 shadow-emerald-500/50"
                        : voiceState === "listening"
                        ? "bg-gradient-to-tr from-blue-500 via-cyan-300 to-sky-200 shadow-blue-500/50"
                        : voiceState === "thinking"
                        ? "bg-gradient-to-tr from-amber-400 via-purple-300 to-pink-400 shadow-purple-500/50"
                        : "bg-gradient-to-tr from-neutral-200 via-neutral-100 to-neutral-300 shadow-white/30"
                    }`}
                  >
                    {/* Inner organic core */}
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white/40 blur-md" />

                    {/* Dynamic Equalizer Lines while speaking */}
                    {voiceState === "speaking" && (
                      <div className="absolute flex items-center gap-1">
                        <span className="h-6 w-1 rounded-full bg-neutral-900 animate-pulse" />
                        <span className="h-10 w-1 rounded-full bg-neutral-900 animate-pulse [animation-delay:0.15s]" />
                        <span className="h-14 w-1 rounded-full bg-neutral-900 animate-pulse [animation-delay:0.3s]" />
                        <span className="h-9 w-1 rounded-full bg-neutral-900 animate-pulse [animation-delay:0.1s]" />
                        <span className="h-5 w-1 rounded-full bg-neutral-900 animate-pulse [animation-delay:0.25s]" />
                      </div>
                    )}
                  </motion.div>
                </button>

                {/* Status Indicator & Live Guidance */}
                <div className="mt-8 text-center">
                  <div className="font-mono-display text-[18px] sm:text-[20px] font-medium tracking-tight">
                    {voiceState === "listening" && (
                      <span className="text-cyan-300 flex items-center justify-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                        Listening to you...
                      </span>
                    )}
                    {voiceState === "speaking" && (
                      <span className="text-emerald-300 flex items-center justify-center gap-2">
                        <span>Speaking...</span>
                        <span className="text-[12px] font-mono text-white/50">(Tap orb to interrupt)</span>
                      </span>
                    )}
                    {voiceState === "thinking" && (
                      <span className="text-purple-300 flex items-center justify-center gap-2">
                        <span>Thinking...</span>
                      </span>
                    )}
                    {voiceState === "idle" && (
                      <span className="text-white/70">
                        {isMicMuted ? "Microphone Muted" : "Tap Orb to Speak"}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 font-mono text-[12px] text-white/40 max-w-[320px] mx-auto">
                    {voiceState === "listening"
                      ? userTranscript || "Speak naturally. I answer directly without texting."
                      : voiceState === "speaking"
                      ? "Listening will auto-resume right when I finish."
                      : "Direct voice conversation grounded with all of Morshed's portfolio."}
                  </p>
                </div>

                {/* Optional Transcript Preview (Collapsible) */}
                {showTranscript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 w-full max-h-36 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-[12px] font-mono text-white/80 space-y-2 scroll-cream"
                  >
                    {transcriptHistory.length === 0 ? (
                      <p className="text-white/40 italic text-center">No messages yet.</p>
                    ) : (
                      transcriptHistory.slice(-4).map((item, idx) => (
                        <div
                          key={idx}
                          className={`${
                            item.role === "user" ? "text-cyan-300 text-right" : "text-emerald-300 text-left"
                          }`}
                        >
                          <span className="font-semibold uppercase text-[10px] text-white/40 mr-1.5">
                            {item.role === "user" ? "You:" : "Bot:"}
                          </span>
                          {item.text}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </div>

              {/* Bottom Call Controls (Like ChatGPT Voice Mode) */}
              <div className="relative z-10 flex w-full items-center justify-center gap-6 pt-4 border-t border-white/10">
                {/* Mute / Unmute Microphone */}
                <button
                  onClick={toggleMicMute}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all border ${
                    isMicMuted
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  }`}
                  aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
                  title={isMicMuted ? "Unmute mic" : "Mute mic"}
                >
                  {isMicMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </button>

                {/* End Voice Call Button (Red Hangup) */}
                <button
                  onClick={handleCloseVoiceMode}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-500 transition-all hover:scale-105 active:scale-95"
                  aria-label="End voice conversation"
                  title="End voice call"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>

                {/* Show/Hide Transcript Toggle */}
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all border ${
                    showTranscript
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/10 border-white/15 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                  aria-label="Toggle text transcript"
                  title={showTranscript ? "Hide transcript" : "Show transcript"}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
