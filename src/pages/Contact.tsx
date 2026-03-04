import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { Send, CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'

type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema)
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const { error: supabaseError } = await supabase
                .from('contact_messages')
                .insert([data] as any)

            if (supabaseError) throw supabaseError

            setIsSuccess(true)
            reset()
            setTimeout(() => setIsSuccess(false), 5000)
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1616332029120-4f8313aad2c5?auto=format&fit=crop&q=80&w=2000"
                        alt="Contact"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4 pt-32">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-studio-gold text-xs font-bold uppercase tracking-[0.3em] mb-6 block"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-[1.1]"
                    >
                        Contact <span className="text-studio-gold italic">Us</span>
                    </motion.h1>
                </div>
            </section>

            <div className="py-24 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="section-tag">Direct Connection</span>
                            <h1 className="section-title">
                                Let's Create <br />
                                <span className="text-studio-gold italic">Something Timeless</span>
                            </h1>
                            <p className="text-gray-500 mb-16 max-w-md text-lg leading-relaxed font-sans">
                                Whether it's a grand wedding or a personal portrait, we're here to preserve your
                                most cherished milestones with professional artistry.
                            </p>

                            <div className="space-y-10">
                                {[
                                    { icon: MapPin, title: 'Visit Studio', detail: 'Serilingampally, Hyderabad, India' },
                                    { icon: Phone, title: 'Call Directly', detail: '+91 9866859567' },
                                    { icon: Mail, title: 'Official Email', detail: 'shreerkstudio@gmail.com' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-studio-gold transition-colors group-hover:bg-studio-gold group-hover:text-white duration-500">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{item.title}</h4>
                                            <p className="text-studio-dark font-serif font-bold text-lg">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="premium-card relative"
                        >
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                                    className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem]"
                                >
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold mb-4">Message Sent</h3>
                                    <p className="text-gray-500 font-sans leading-relaxed">
                                        Thank you for reaching out. We've received your inquiry and will be in touch shortly.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-10 text-studio-gold font-bold uppercase tracking-[0.2em] text-[10px] hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            )}

                            <div className="flex items-center gap-3 mb-10">
                                <Sparkles className="w-5 h-5 text-studio-gold/50" />
                                <h2 className="text-2xl font-serif font-bold text-studio-dark">Send an Inquiry</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Full Name</label>
                                        <input
                                            {...register('name')}
                                            placeholder="John Doe"
                                            className={`input-field ${errors.name ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                                        />
                                        {errors.name && <p className="mt-3 text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2 ml-2"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Phone Number</label>
                                        <input
                                            {...register('phone')}
                                            placeholder="+91 98668 59567"
                                            className={`input-field ${errors.phone ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                                        />
                                        {errors.phone && <p className="mt-3 text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2 ml-2"><AlertCircle className="w-3 h-3" /> {errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Your Message</label>
                                    <textarea
                                        {...register('message')}
                                        rows={6}
                                        placeholder="Tell us about your event and requirements..."
                                        className={`input-field resize-none py-6 ${errors.message ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                                    />
                                    {errors.message && <p className="mt-3 text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2 ml-2"><AlertCircle className="w-3 h-3" /> {errors.message.message}</p>}
                                </div>

                                {error && (
                                    <div className="p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-4 animate-in shake duration-500">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary disabled:opacity-50 group"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Allocating Lens...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3">
                                            Send Message <Send className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AnimatePage>
    )
}

export default Contact
