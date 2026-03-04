import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { Loader2, Camera, ArrowRight, Sparkles, Clock, Award, Heart, ShoppingBag, Gift, Calendar, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'
import { Link } from 'react-router-dom'

type Service = Database['public']['Tables']['services']['Row']

const FEATURED_SERVICES = [
    { icon: Heart, title: 'Wedding Photography', desc: 'Capture your special day with cinematic storytelling and timeless portraits', image: 'https://images.unsplash.com/photo-1623253549221-fda29de68997?auto=format&fit=crop&q=80&w=1000' },
    { icon: Camera, title: 'Portrait Sessions', desc: 'Professional portraits for individuals, families, and professional profiles', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1000' },
    { icon: Sparkles, title: 'Event Coverage', desc: 'Complete event photography for corporate functions, parties, and celebrations', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000' },
    { icon: Award, title: 'Product Photography', desc: 'High-quality product shots for e-commerce, catalogs, and advertising', image: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&q=80&w=1000' },
]

const STATS = [
    { number: '24+', label: 'Years Experience' },
    { number: '10K+', label: 'Happy Clients' },
    { number: '50K+', label: 'Photos Delivered' },
    { number: '100+', label: 'Awards Won' },
]

const Services = () => {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching services:', error)
            } else {
                setServices(data || [])
            }
            setLoading(false)
        }

        fetchServices()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
                <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
            </div>
        )
    }

    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000"
                        alt="Indian Photography"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4 pt-20 sm:pt-24 md:pt-32">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-studio-gold text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] mb-4 sm:mb-6 block"
                    >
                        Excellence in every frame
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-8 leading-[1.1]"
                    >
                        Our <span className="text-studio-gold italic">Services</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
                    >
                        From intimate portraits to grand wedding celebrations, we offer diverse professional 
                        photography services tailored to your unique story.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-16 sm:-mt-20 z-20">
                <div className="max-w-6xl mx-auto px-3 sm:px-4">
                    <div className="glass rounded-2xl sm:rounded-[3rem] p-4 sm:p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-serif font-bold text-studio-gold mb-2">{stat.number}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services */}
            <section className="py-12 sm:py-16 md:py-24 bg-studio-neutral">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="section-tag"
                        >
                            What We Offer
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-title text-3xl sm:text-4xl md:text-5xl"
                        >
                            Featured Services
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {FEATURED_SERVICES.map((service, i) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-[2rem] cursor-pointer"
                            >
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-studio-dark/90 via-studio-dark/30 to-transparent" />
                                </div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <div className="w-12 h-12 rounded-full bg-studio-gold/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <service.icon className="w-5 h-5 text-studio-gold" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-2">{service.title}</h3>
                                    <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {service.desc}
                                    </p>
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-studio-gold hover:text-white transition-colors"
                                    >
                                        Enquire <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Database Services */}
            <section className="py-12 sm:py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="section-tag"
                        >
                            Our Expertise
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-title text-3xl sm:text-4xl md:text-5xl"
                        >
                            What We Offer
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Quick Links Cards */}
                        {[
                            { icon: ShoppingBag, title: 'Shop Frames', desc: 'Browse our collection of premium photo frames', path: '/frames', color: 'bg-studio-dark' },
                            { icon: Package, title: 'Packages', desc: 'Pre-defined photography packages', path: '/packages', color: 'bg-studio-gold' },
                            { icon: Calendar, title: 'Book Now', desc: 'Schedule your photography session', path: '/booking', color: 'bg-green-500' },
                            { icon: Gift, title: 'Gift Vouchers', desc: 'Perfect gift for your loved ones', path: '/gift-vouchers', color: 'bg-rose-500' },
                        ].map((item, i) => (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="premium-card group hover:-translate-y-2 transition-all duration-300 h-full flex flex-col"
                                >
                                    <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl ${item.color} flex items-center justify-center mb-3 sm:mb-4`}>
                                        <item.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-serif font-bold mb-1 sm:mb-2 group-hover:text-studio-gold transition-colors">{item.title}</h3>
                                    <p className="text-gray-500 text-xs sm:text-sm flex-1 line-clamp-2">{item.desc}</p>
                                    <span className="text-studio-gold text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4">
                                        Explore <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                                    </span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Database Services */}
                    {services.length > 0 ? (
                        <div className="mt-16">
                            <h3 className="text-2xl font-serif font-bold text-center mb-8">Photography Services</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, i) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="premium-card !p-0 overflow-hidden group"
                                >
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={service.image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000'}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full text-studio-gold font-bold text-xs shadow-lg">
                                            {service.price || 'Contact'}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-studio-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-studio-gold" />
                                            <h3 className="text-xl font-serif font-bold transition-colors group-hover:text-studio-gold">{service.title}</h3>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-studio-dark font-semibold text-xs">{service.turnaround_time || 'Standard'}</span>
                                            </div>
                                            <a href="/contact" className="btn-primary !px-5 !py-2.5 !text-[9px]">
                                                Book Now
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-24 bg-studio-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6">
                            Ready to Create Something <span className="text-studio-gold italic">Beautiful?</span>
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto">
                            Book your session today and let us capture your precious moments with our expert photography services.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <a href="/booking" className="btn-primary !px-6 sm:!px-8 !py-3 sm:!py-4">
                                Book a Session
                            </a>
                            <a href="/portfolio" className="btn-outline !px-6 sm:!px-8 !py-3 sm:!py-4 !text-white !border-white/30 hover:!bg-white hover:!text-studio-dark">
                                View Portfolio
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AnimatePage>
    )
}

export default Services
