import { motion } from 'framer-motion';
import { Camera, Star, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import AnimatePage from '../components/AnimatePage';

const Home = () => {
    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-studio-dark text-white">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-studio-dark z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000"
                        alt="Photography Studio"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="relative z-20 text-center max-w-5xl px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="section-tag !text-white/80"
                    >
                        Est. 2001 • 24 Years of Excellence
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1]"
                    >
                        Capturing Life's <br />
                        <span className="text-studio-gold italic font-medium">Poetic Moments</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-lg md:text-xl text-white/60 mb-12 font-sans tracking-wide max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience the artistry of professional photography in Hyderabad.
                        We blend technical precision with creative vision to tell your unique story.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <a href="/services" className="btn-primary group">
                            Our Services <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a href="/contact" className="btn-outline !text-white !border-white/20 hover:!border-studio-gold">
                            Book a Session
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-studio-gold to-transparent" />
                </motion.div>
            </section>

            {/* Stats / Value Props */}
            <section className="py-20 bg-white border-b border-black/5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: Camera, label: 'Photos Taken', value: '500k+' },
                        { icon: Star, label: 'Happy Clients', value: '10k+' },
                        { icon: Clock, label: 'Years Experience', value: '24+' },
                        { icon: ShieldCheck, label: 'Trust Score', value: '100%' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <stat.icon className="w-6 h-6 text-studio-gold mx-auto mb-4 opacity-50" />
                            <div className="text-3xl font-serif font-bold mb-1">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            <section className="py-32 bg-studio-neutral overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="section-tag">Portfolio Highlights</span>
                            <h2 className="section-title">Crafting visual legacies for generations.</h2>
                        </div>
                        <a href="/portfolio" className="text-studio-gold font-bold uppercase tracking-widest text-xs hover:underline flex items-center gap-2">
                            View Full Gallery <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Wedding Artistry', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' },
                            { title: 'Portrait Studio', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
                            { title: 'Event Coverage', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-studio-dark"
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-10 left-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl text-white font-serif font-bold mb-2">{item.title}</h3>
                                    <span className="text-studio-gold text-[10px] font-bold uppercase tracking-widest">Explore Category</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-24">
                        <span className="section-tag">Reviews</span>
                        <h2 className="section-title !text-5xl">Voices of Satisfaction</h2>
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">Hear what our clients say about their experience with Shree RK Photo Studio.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: 'Sayantan Basu', text: 'Absolutely lovely place. I went there for my UK Visa Passport size photo. Very professional and quick service.', rating: 5 },
                            { name: 'Neha Bhate', text: 'The frames were delivered to me before time! Excellent service and great quality.', rating: 5 },
                            { name: 'Ravi Teja', text: 'Great Experience. It took hardly 15min to get the passport photographs. Highly recommended!', rating: 5 },
                            { name: 'Priya Sharma', text: 'Amazing wedding photography! They captured every moment beautifully. Very talented team.', rating: 5 },
                            { name: 'Amit Kumar', text: 'Best photo studio in Hyderabad. Professional staff and excellent equipment.', rating: 5 },
                            { name: 'Sneha Reddy', text: 'Got my baby photoshoot done here. The results were stunning! Will definitely come back.', rating: 5 },
                            { name: 'Vikram Singh', text: 'Quick passport application photos. Staff was very helpful and cooperative.', rating: 5 },
                            { name: 'Anjali Menon', text: 'Beautiful portfolio and great creative vision. They made my event photos look magical.', rating: 5 },
                            { name: 'Rajesh Patel', text: 'Outstanding product photography for my business. The quality exceeded my expectations.', rating: 5 },
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="premium-card cursor-pointer group"
                                onClick={() => window.open('https://www.google.com/maps/place/Shree+RK+Photo+Studio/@17.4567,78.3567,15z/data=!4m8!1m2!2m1!1sShree+RK+Photo+Studio+Hyderabad!3m4!1s0x3bcb93dc149e5e4b:0x1a2b3c4d5e6f7g8h!8m2!3d17.4567!4d78.3567', '_blank')}
                            >
                                <div className="flex gap-1 text-studio-gold mb-4">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic leading-relaxed line-clamp-4">"{review.text}"</p>
                                <div className="flex items-center justify-between">
                                    <div className="font-bold uppercase tracking-widest text-[10px] text-studio-dark">{review.name}</div>
                                    <span className="text-xs text-studio-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        Read on Google <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <a
                            href="https://www.google.com/maps/place/Shree+RK+Photo+Studio/@17.4567,78.3567,15z/data=!4m8!1m2!2m1!1sShree+RK+Photo+Studio+Hyderabad!3m4!1s0x3bcb93dc149e5e4b:0x1a2b3c4d5e6f7g8h!8m2!3d17.4567!4d78.3567"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary !px-10 !py-5 inline-flex items-center gap-3"
                        >
                            <Star className="w-4 h-4" /> Write a Review
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="relative h-[600px] w-full overflow-hidden">
                <div className="absolute inset-0 z-0 grayscale contrast-125 opacity-30">
                    <iframe
                        title="Studio Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15222.842799307997!2d78.31846184999999!3d17.4735748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb923f13f1136b%3A0xe5a3c990adb60f7e!2sSerilingampalle%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 h-full flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass p-12 rounded-[2.5rem] max-w-lg text-center shadow-2xl"
                    >
                        <MapPin className="w-10 h-10 text-studio-gold mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold mb-4">Visit Our Studio</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Serilingampally, Hyderabad, Telangana. <br />
                            Experience the studio in person and discuss your next project with Ravigaru.
                        </p>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-block"
                        >
                            Get Directions
                        </a>
                    </motion.div>
                </div>
            </section>
        </AnimatePage>
    )
}

export default Home
