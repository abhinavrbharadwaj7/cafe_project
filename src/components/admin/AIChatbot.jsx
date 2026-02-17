import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Mic, BrainCircuit, Activity } from "lucide-react";
import { useCafe } from "../../context/CafeContext";
import { chatWithAI, KITCHEN_SYSTEM_PROMPT } from "../../lib/openai";
import { MOCK_TABLES, MOCK_STAFF, MOCK_INVENTORY } from "../../lib/mockContext";

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "KitchenOS connected. Awaiting commands." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const { orders } = useCafe();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const cleanText = text
                .replace(/[*#`_]/g, '')
                .replace(/https?:\/\/\S+/g, 'link')
                .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
                .replace(/\s+/g, ' ')
                .trim();

            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voices = window.speechSynthesis.getVoices();

            const preferredVoice = voices.find(v =>
                v.name.includes("Google US English") ||
                v.name.includes("Microsoft Zira") ||
                v.name.includes("Natural") ||
                v.name.includes("Samantha")
            );

            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 1.0;
            utterance.pitch = 1.05;
            utterance.volume = 1.0;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async (textOverride = null, isVoice = false) => {
        const contentToSend = textOverride || input;
        if (!contentToSend.trim()) return;

        const userMessage = { role: "user", content: contentToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        const context = `
SYSTEM STATUS LAYOUT:
---------------------
[ACTIVE ORDERS]
${JSON.stringify(orders.map(o => ({ id: o.id, table: o.tableId, status: o.status, total: o.total, items: o.items.map(i => i.name) })))}

[TABLE GRID]
${JSON.stringify(MOCK_TABLES)}

[STAFF ROSTER]
${JSON.stringify(MOCK_STAFF)}

[INVENTORY SENSORS]
${JSON.stringify(MOCK_INVENTORY)}
        `;

        const response = await chatWithAI(
            [...messages, userMessage],
            KITCHEN_SYSTEM_PROMPT + "\n\nCONTEXT:\n" + context,
            null
        );

        setMessages(prev => [...prev, response]);
        setIsTyping(false);

        if (isVoice) {
            speak(response.content);
        }
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Keep voice mode open, just stop listening momentarily
                handleSend(transcript, true);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [messages, orders]);

    const toggleVoice = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported.");
            return;
        }
        setIsVoiceMode(true);
        setIsListening(true);
        recognitionRef.current.start();
        setInput("");
    };

    const stopVoiceMode = () => {
        setIsVoiceMode(false);
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        window.speechSynthesis.cancel();
    };

    const renderContent = (content) => {
        try {
            let jsonString = content.trim();

            if (jsonString.includes("```")) {
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
            }

            const firstOpen = jsonString.indexOf('{');
            const lastClose = jsonString.lastIndexOf('}');

            if (firstOpen !== -1 && lastClose !== -1) {
                jsonString = jsonString.substring(firstOpen, lastClose + 1);
                const data = JSON.parse(jsonString);

                if (data.type === 'chart') {
                    return (
                        <div className="mt-2 w-full">
                            <p className="mb-2 font-bold text-xs uppercase tracking-widest text-cyan-400">{data.title}</p>
                            <p className="text-xs mb-3 opacity-80">{data.message}</p>
                            <div className="h-40 flex items-end justify-between gap-2 p-4 bg-black/40 rounded-xl border border-white/10">
                                {data.data.datasets[0].data.map((val, i) => {
                                    const maxVal = Math.max(...data.data.datasets[0].data) || 100;
                                    const heightPct = Math.max((val / maxVal) * 100, 5);
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${heightPct}%` }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                className="w-full bg-cyan-500 rounded-t-sm relative group hover:bg-cyan-400 transition-colors"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 border border-white/20 text-white text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                    {val}
                                                </div>
                                            </motion.div>
                                            <span className="text-[9px] text-stone-400 font-bold font-mono truncate w-full text-center">{data.data.labels[i] || i}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                if (data.type === 'alert') {
                    return (
                        <div className="mt-2 w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <Activity className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">System Alert: {data.item}</p>
                                <p className="text-xs text-stone-300 mb-2">Level Critical: {data.level}</p>
                                <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors">
                                    {data.action}
                                </button>
                            </div>
                        </div>
                    );
                }
            }
        } catch (e) { }
        return content;
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-stone-900 border border-white/10 shadow-2xl flex items-center justify-center group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_4s_linear_infinite]" />
                <BrainCircuit className="text-cyan-400 relative z-10" size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-stone-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                    <Bot size={18} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide">KITCHEN OS CORE</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-stone-400 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-stone-800 text-white rounded-br-none border border-white/5'
                                        : 'bg-cyan-950/30 text-cyan-100 rounded-bl-none border border-cyan-500/20'
                                        }`}>
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-cyan-950/30 p-3 rounded-2xl rounded-bl-none border border-cyan-500/20 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75" />
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
                            <button
                                onClick={toggleVoice}
                                className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-stone-800 text-stone-400 hover:text-white border border-white/5 hover:border-white/20'}`}
                            >
                                <Mic size={18} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a command..."
                                className="flex-1 bg-stone-900 border border-white/5 rounded-xl px-4 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
                            >
                                <Send size={18} />
                            </button>
                        </div>

                        {isVoiceMode && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
                                    <motion.div
                                        animate={{
                                            scale: isListening ? [1, 1.5, 1] : 1,
                                            rotate: [0, 90, 0],
                                            x: [-30, 30, -30],
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-56 h-56 bg-blue-600 rounded-full blur-[80px] absolute mix-blend-screen"
                                    />
                                    <motion.div
                                        animate={{
                                            scale: isListening ? [1.2, 0.8, 1.2] : 1,
                                            rotate: [0, -60, 0],
                                            y: [-30, 30, -30],
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="w-56 h-56 bg-purple-600 rounded-full blur-[80px] absolute mix-blend-screen translate-x-10"
                                    />
                                    <motion.div
                                        animate={{
                                            scale: isListening ? [0.8, 1.2, 0.8] : 1,
                                            x: [30, -30, 30],
                                        }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="w-48 h-48 bg-cyan-500 rounded-full blur-[80px] absolute mix-blend-screen -translate-x-10 translate-y-10"
                                    />
                                </div>

                                <div className="relative z-10 flex flex-col items-center gap-8">
                                    <motion.div
                                        animate={{
                                            scale: isListening ? [1, 1.05, 1] : 1,
                                            boxShadow: isListening ? ["0 0 20px rgba(59,130,246,0.3)", "0 0 40px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.3)"] : "none"
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        onClick={() => {
                                            if (!isListening) {
                                                setIsListening(true);
                                                recognitionRef.current.start();
                                            } else {
                                                setIsListening(false);
                                                recognitionRef.current.stop();
                                            }
                                        }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Mic size={36} className="text-white" />
                                    </motion.div>

                                    <div className="space-y-2 text-center h-20">
                                        <p className="text-2xl font-light text-white tracking-wide">
                                            {isListening ? "Listening..." : "Tap to Speak"}
                                        </p>
                                        <p className="text-sm text-blue-200 uppercase tracking-wide opacity-80 max-w-[280px] mx-auto truncate">
                                            {messages[messages.length - 1]?.role === 'assistant'
                                                ? messages[messages.length - 1].content.replace(/[*#]/g, '')
                                                : "Try 'Show me the sales trend'"}
                                        </p>
                                    </div>

                                    <div className="flex gap-1.5 h-12 items-center">
                                        {isListening ? [...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [12, 40, 12] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.6,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"
                                            />
                                        )) : (
                                            <div className="w-full h-1 bg-white/10 rounded-full" />
                                        )}
                                    </div>

                                    <button
                                        onClick={stopVoiceMode}
                                        className="mt-6 w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-300 transition-colors hover:scale-105 active:scale-95"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;
