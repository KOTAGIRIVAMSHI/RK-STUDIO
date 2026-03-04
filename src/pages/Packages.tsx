import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'
import { useNavigate } from 'react-router-dom'
import { Star, Clock, Users, Camera, Check, ArrowRight } from 'lucide-react'

const packages = [
    {
        id: 'wedding-basic',
        name: 'Wedding Basic',
        description: 'Perfect for intimate weddings and court marriages',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        features: ['4 Hours Coverage', '1 Photographer', '100+ Edited Photos', 'Online Gallery', 'Digital Delivery'],
        popular: false
    },
    {
        id: 'wedding-standard',
        name: 'Wedding Standard',
        description: 'Ideal for traditional Hindu weddings',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1623253549221-fda29de68997?auto=format&fit=crop&q=80&w=800',
        features: ['8 Hours Coverage', '1 Photographer + 1 Assistant', '300+ Edited Photos', '1 Premium Album', 'Teaser Video', 'Online Gallery'],
        popular: true
    },
    {
        id: 'wedding-premium',
        name: 'Wedding Premium',
        description: 'Complete wedding coverage with cinematic film',
        price: 75000,
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
        features: ['Full Day Coverage', '2 Photographers + 1 Assistant', 'Unlimited Photos', '2 Premium Albums', 'Wedding Film (5-7 min)', 'Drone Coverage', 'Same-day Edit'],
        popular: false
    },
    {
        id: 'portrait-basic',
        name: 'Portrait Basic',
        description: 'Individual or couple portraits',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
        features: ['1 Hour Session', '1 Photographer', '15 Edited Photos', '2 Backgrounds', 'Online Gallery'],
        popular: false
    },
    {
        id: 'portrait-premium',
        name: 'Portrait Premium',
        description: 'Family and professional portraits',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
        features: ['2 Hour Session', '1 Photographer', '40 Edited Photos', '4 Backgrounds', '1 Large Print (24x36)', 'Online Gallery'],
        popular: false
    },
    {
        id: 'event-corporate',
        name: 'Corporate Event',
        description: 'Conference and corporate gatherings',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
        features: ['4 Hours Coverage', '1 Photographer', '200+ Photos', 'Brand Logo Integration', 'Online Gallery', 'Quick Turnaround'],
        popular: false
    }
]

const Packages = () => {
    const navigate = useNavigate()

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    }

    return (
        <AnimatePage>
            <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" alt="Packages" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center px-4 pt-32">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-studio-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Packages</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-white">Photography Packages</motion.h1>
                </div>
            </section>

            <section className="py-24 bg-studio-neutral">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg, i) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`premium-card !p-0 overflow-hidden flex flex-col ${pkg.popular ? 'ring-2 ring-studio-gold' : ''}`}
                            >
                                {pkg.popular && (
                                    <div className="bg-studio-gold text-white text-xs font-bold uppercase tracking-widest py-2 text-center">
                                        Most Popular
                                    </div>
                                )}
                                <div className="h-48 overflow-hidden">
                                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="font-serif font-bold text-2xl mb-2">{pkg.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
                                    <div className="mb-6">
                                        <span className="text-3xl font-serif font-bold text-studio-gold">{formatPrice(pkg.price)}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-studio-gold" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={() => navigate('/booking')}
                                        className="w-full btn-primary flex items-center justify-center gap-2"
                                    >
                                        Book Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-studio-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Need a Custom Package?
                        </h2>
                        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                            We offer customized photography packages tailored to your specific requirements. 
                            Contact us to discuss your needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="btn-primary !px-10">Contact Us</a>
                            <a href="/booking" className="btn-outline !px-10 !text-white !border-white/30 hover:!bg-white hover:!text-studio-dark">Book Consultation</a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AnimatePage>
    )
}

export default Packages
