import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import Canvas3D from '../components/Canvas3D'

const Contact = () => {
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hello! I'm J.Teerisalo's AI assistant. How can I help you today?" }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { role: 'user', text: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages,
                    message: input
                })
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Failed to communicate with AI assistant')
            }

            setMessages(prev => [...prev, { role: 'model', text: data.reply }])
        } catch (error) {
            console.error("Error generating content:", error)
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message || "Unknown error occurred"}.` }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
            <Canvas3D variant="spaceship" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full h-[70vh] bg-gray-900/90 backdrop-blur-xl rounded-2xl relative z-10 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gray-800/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">AI J.Teerisalo</h2>
                        <p className="text-xs text-purple-400 font-medium tracking-wider uppercase">Powered by Gemini</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                                }`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none'
                                : 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-tl-none'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-purple-600/20 border border-purple-500/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-purple-400" />
                                <span className="text-sm text-purple-300">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-gray-800/50 border-t border-white/10">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about my work..."
                            className="w-full bg-gray-900 text-white rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-lg transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Contact
