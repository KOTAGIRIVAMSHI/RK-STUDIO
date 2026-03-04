import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Loader2, MessageSquare, CheckCircle, Clock, Phone, Mail, User, Sparkles, ArrowRight } from 'lucide-react'
import { Database } from '../../types/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatePage from '../../components/AnimatePage'

type Message = Database['public']['Tables']['contact_messages']['Row']

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        setMessages(data || [])
        setLoading(false)
    }

    const toggleContacted = async (id: string, currentStatus: boolean) => {
        // @ts-ignore
        await supabase.from('contact_messages').update({ contacted: !currentStatus }).eq('id', id)
        fetchMessages()
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this message?')) {
            await supabase.from('contact_messages').delete().eq('id', id)
            fetchMessages()
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
            <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
        </div>
    );

    return (
        <AnimatePage>
            <div className="py-24 md:py-32 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-20">
                        <span className="section-tag">Communication Hub</span>
                        <h1 className="text-5xl font-serif font-bold text-studio-dark">Client <span className="text-studio-gold italic">Inquiries</span></h1>
                    </header>

                    <div className="space-y-10">
                        <AnimatePresence mode='popLayout'>
                            {messages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card !p-32 text-center border-2 border-dashed border-black/5"
                                >
                                    <MessageSquare className="w-20 h-20 text-studio-gold/10 mx-auto mb-8" />
                                    <h2 className="text-2xl font-serif font-bold text-gray-400">All Scanned</h2>
                                    <p className="text-gray-400 mt-2 font-sans tracking-wide">No new messages in your inbox.</p>
                                </motion.div>
                            ) : (
                                messages.map((msg, i) => (
                                    <motion.div
                                        layout
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`premium-card !p-10 transition-all flex flex-col lg:flex-row gap-12 relative overflow-hidden ${msg.contacted ? 'opacity-60 bg-white/40' : 'bg-white shadow-xl border-studio-gold/10'}`}
                                    >
                                        {!msg.contacted && (
                                            <div className="absolute top-0 right-10 w-32 h-2 bg-studio-gold rounded-b-full shadow-[0_0_20px_rgba(197,160,89,0.3)]" />
                                        )}

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-6 mb-10">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-studio-neutral flex items-center justify-center text-studio-gold shadow-inner">
                                                    <User className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-serif font-bold text-studio-dark mb-1">{msg.name}</h3>
                                                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">
                                                        <Clock className="w-3 h-3 text-studio-gold/50" />
                                                        {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative mb-10">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-studio-gold/10 rounded-full" />
                                                <p className="pl-8 text-studio-dark/70 text-lg font-sans leading-relaxed italic">
                                                    "{msg.message}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-8">
                                                <a href={`tel:${msg.phone}`} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-studio-gold hover:opacity-70 transition-opacity">
                                                    <div className="w-8 h-8 rounded-full bg-studio-gold/5 flex items-center justify-center">
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </div>
                                                    {msg.phone || 'NO PHONE'}
                                                </a>
                                                <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </div>
                                                    Via Website Form
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col gap-6 justify-center items-center lg:border-l lg:border-black/5 lg:pl-12">
                                            <button
                                                onClick={() => toggleContacted(msg.id, msg.contacted)}
                                                className={`flex items-center gap-3 px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${msg.contacted
                                                    ? 'bg-studio-neutral text-gray-400'
                                                    : 'bg-studio-gold text-white shadow-lg hover:shadow-2xl hover:-translate-y-1'
                                                    }`}
                                            >
                                                {msg.contacted ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                {msg.contacted ? 'Archived' : 'Complete'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="w-12 h-12 flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AnimatePage>
    )
}

export default Messages
