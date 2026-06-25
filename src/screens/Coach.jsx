import React, { useState, useRef, useEffect } from "react";
import { getProfile } from "../lib/profileStore";
import { askCoach } from "../lib/claudeApi";
import { Card, Label, TopBar, StyleDNACard } from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "My hair is thin, help",
  "Best routine for oily skin",
  "How to maintain wolf cut",
  "5 min morning routine",
  "My skin feels dull lately",
  "Beard care basics",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const chipVariants = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0 }
};

export function Coach() {
  const profile = getProfile();
  
  const [messages, setMessages] = useState([
    {
      sender: "coach",
      text: `Hello ${profile.name || "there"}. I am your Beauty Intelligence advisor. Every feature you have is a strength — let's find the best way to amplify it. What are we styling today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || textToSend.trim() === "") return;
    
    // Add user message
    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await askCoach(profile, textToSend, messages);
      setMessages((prev) => [...prev, { sender: "coach", text: response }]);
    } catch (e) {
      console.error("Coach chat error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex-grow flex flex-col bg-transparent animate-fade-rise h-[calc(100vh-190px)] overflow-hidden">
      <TopBar title="Beauty Intelligence" subtitle="Zero-judgment grooming counsel based on Style DNA" />

      {/* Main Grid Split Layout for Desktop Chat */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden flex-1 min-h-0">
        
        {/* Left Sidebar Panel: Quick Query Topics (Col 4) */}
        <div className="lg:col-span-4 space-y-4 lg:h-full flex flex-col justify-between overflow-y-auto scrollbar-none pb-4 pr-1 flex-shrink-0">
          <div className="space-y-4">
            <Card className="p-6 space-y-4 shadow-sm bg-gradient-to-tr from-surface to-surface/70 border-hairline">
              <div className="border-b border-hairline pb-2">
                <Label variant="violet">Suggested Queries</Label>
              </div>
              <p className="text-[11px] text-graymuted leading-normal">
                Select any of the parameters below to ask our Intelligence Advisor for curated self-care remedies.
              </p>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-2"
              >
                {SUGGESTIONS.map((sug, idx) => {
                  const labelMap = {
                    "My hair is thin, help": "Thin Hair",
                    "Best routine for oily skin": "Oily Skin",
                    "How to maintain wolf cut": "Wolf Cut",
                    "5 min morning routine": "Morning routine",
                    "My skin feels dull lately": "Dull Skin",
                    "Beard care basics": "Beard Care"
                  };
                  return (
                    <motion.button
                      key={idx}
                      variants={chipVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(sug)}
                      disabled={loading}
                      className="p-2.5 border border-hairline hover:border-violet bg-surface hover:bg-violet/5 transition-all text-[10px] font-display font-bold uppercase tracking-wider text-ink rounded-lg cursor-pointer text-center truncate"
                      title={sug}
                    >
                      {labelMap[sug] || sug}
                    </motion.button>
                  );
                })}
              </motion.div>
            </Card>
          </div>
          
          {/* Style DNA Core persistent card */}
          <StyleDNACard layout="sidebar" />

          {/* Philosophy widget */}
          <div className="space-y-3.5 select-none">
            <div className="bg-violet/5 border border-hairline rounded-lg p-4 text-center space-y-2">
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[9px] text-graymuted font-body">
                <span className="text-violet font-semibold">✓ No beauty scores</span>
                <span className="text-neon font-semibold">✓ No attractiveness ratings</span>
                <span className="text-[#00b0c7] font-semibold">✓ Style discovery, not judgment</span>
              </div>
              <p className="text-[9px] text-graymuted/80 italic font-body leading-tight">
                Built to amplify your features.
              </p>
            </div>
            
            <div className="text-[10px] text-graymuted font-body text-center">
              🔒 Safe & secure connection. All dialogues remain in local memory.
            </div>
          </div>
        </div>

        {/* Right Main Panel: Active Message Thread & Input (Col 8) */}
        <div className="lg:col-span-8 flex flex-col bg-surface border border-hairline rounded-lg shadow-md h-full overflow-hidden mb-6 relative">
          
          {/* Thread Header */}
          <div className="bg-base border-b border-hairline py-4 px-6 flex justify-between items-center select-none flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="font-display font-bold text-xs tracking-wider text-ink uppercase flex items-center space-x-1.5">
                <span>Personalized Insights Active</span>
                <span className="text-[8px] bg-violet/10 border border-violet/20 text-violet px-2 py-0.5 rounded-full font-display font-bold uppercase tracking-wider">Style DNA Connected</span>
              </span>
            </div>
            <span className="text-[9px] text-graymuted font-display font-bold uppercase tracking-widest">
              Style DNA Core
            </span>
          </div>

          {/* Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 flex flex-col scrollbar-none bg-surface/30">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {isUser ? (
                      <div 
                        className="max-w-[75%] bg-violet text-white py-3 px-4 text-xs font-body leading-relaxed rounded-lg rounded-tr-none shadow-sm select-text"
                      >
                        {msg.text}
                      </div>
                    ) : (
                      <Card 
                        className="max-w-[75%] border-l-[3px] border-neon bg-surface space-y-1 py-3.5 px-4 select-text rounded-tl-none shadow-sm hover:border-violet/40 transition-colors"
                      >
                        <div className="flex justify-between items-center select-none border-b border-hairline/60 pb-1 mb-1">
                          <Label variant="neon" className="text-[9px] tracking-widest font-bold flex items-center space-x-1">
                            <span>✦</span>
                            <span>PERSONALIZED INSIGHTS</span>
                          </Label>
                          <span className="text-[8px] text-graymuted font-display uppercase tracking-wider font-bold">
                            Advisor
                          </span>
                        </div>
                        <p className="text-xs text-ink leading-relaxed font-body">
                          {msg.text}
                        </p>
                      </Card>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Thinking state */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full justify-start"
              >
                <Card className="max-w-[75%] border-l-[3px] border-hairline bg-surface py-3.5 px-4 space-y-1 select-none rounded-tl-none shadow-sm">
                  <Label variant="graymuted" className="text-[9px] tracking-widest">
                    ANALYZING DATA
                  </Label>
                  <div className="flex space-x-2 py-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-violet rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-1.5 h-1.5 bg-neon rounded-full animate-bounce" style={{ animationDelay: "0.25s" }} />
                    <div className="w-1.5 h-1.5 bg-[#00b0c7] rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                  </div>
                </Card>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-4 border-t border-hairline bg-base flex items-center space-x-3 select-none flex-shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a styling or grooming question based on your Style DNA..."
              className="flex-1 bg-surface border border-hairline py-3 px-4 text-xs text-ink font-body placeholder:text-graymuted focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors rounded-lg shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-violet hover:bg-neon text-white w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer active:scale-95 rounded-lg shadow-glow-violet hover:shadow-glow-neon"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
          
          <div className="bg-base/60 text-center py-2 border-t border-hairline text-[8px] text-graymuted font-display tracking-widest uppercase flex-shrink-0 select-none">
            Style DNA Intelligence Core • Amplifying Your Contours
          </div>
        </div>

      </div>
    </div>
  );
}
export default Coach;
