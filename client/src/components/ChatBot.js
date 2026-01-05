import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! 👋 I'm FreshBot. How can I help you?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const endRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Add User Message
        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // 2. Simulate "Thinking" delay
        setTimeout(() => {
            const botResponse = getBotResponse(userMsg.text);
            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 600);
    };

    // ---  THE BRAIN (Rule-Based Logic) ---
    const getBotResponse = (text) => {
        const lower = text.toLowerCase();
        
        if (lower.includes("hello") || lower.includes("hi")) return "Hello! Welcome to FreshCart. 🍎";
        if (lower.includes("order") || lower.includes("track")) return "You can view your order history by clicking 'Orders' in the menu.";
        if (lower.includes("pay") || lower.includes("card")) return "We accept all major credit cards. Payment is secure!";
        if (lower.includes("return") || lower.includes("refund")) return "You can return fresh items within 24 hours if they are damaged.";
        if (lower.includes("shipping") || lower.includes("delivery")) return "We deliver within 1-2 business days across the city.";
        if (lower.includes("contact") || lower.includes("support")) return "You can email us at support@freshcart.com.";
        if (lower.includes("thank")) return "You're welcome! Happy shopping! 🛒";
        
        return "I'm not sure about that. Try asking about 'orders', 'shipping', or 'returns'.";
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'Arial, sans-serif' }}>
            
            {/* 💬 CHAT WINDOW */}
            {isOpen && (
                <div style={windowStyle}>
                    <div style={headerStyle}>
                        <span>🤖 FreshBot Support</span>
                        <button onClick={() => setIsOpen(false)} style={closeBtn}>×</button>
                    </div>
                    
                    <div style={bodyStyle}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                background: msg.isBot ? '#e9ecef' : '#2b6cb0',
                                color: msg.isBot ? 'black' : 'white',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                maxWidth: '80%',
                                marginBottom: '8px',
                                fontSize: '0.9rem'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={endRef}></div>
                    </div>

                    <form onSubmit={handleSend} style={footerStyle}>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            style={inputStyle}
                        />
                        <button type="submit" style={sendBtn}>➤</button>
                    </form>
                </div>
            )}

            {/* 🔘 FLOATING BUTTON */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={fabStyle}
                >
                    💬
                </button>
            )}
        </div>
    );
};

// --- STYLES ---
const fabStyle = { width: '60px', height: '60px', borderRadius: '50%', background: '#2b6cb0', color: 'white', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const windowStyle = { width: '300px', height: '400px', background: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const headerStyle = { background: '#2b6cb0', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' };
const closeBtn = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const bodyStyle = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' };
const footerStyle = { padding: '10px', borderTop: '1px solid #eee', display: 'flex' };
const inputStyle = { flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', paddingLeft: '15px' };
const sendBtn = { background: 'none', border: 'none', color: '#2b6cb0', fontSize: '18px', cursor: 'pointer', marginLeft: '10px' };

export default ChatBot;