import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import { Loader2, Filter, X, Maximize2, Camera } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type PortfolioItem = Database['public']['Tables']['portfolio']['Row']

const Portfolio = () => {
    const [items, setItems] = useState<PortfolioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string>('All')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const categories = ['All', 'Wedding', 'Passport', 'Event']

    useEffect(() => {
        const fetchPortfolio = async () => {
            const { data, error } = await supabase
                .from('portfolio')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching portfolio:', error)
            } else {
                setItems(data || [])
            }
            setLoading(false)
        }

        fetchPortfolio()
    }, [])

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase())

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
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80&w=2000"
                        alt="Portfolio"
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
                        A legacy in pixels
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-[1.1]"
                    >
                        Visual <span className="text-studio-gold italic">Portfolio</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Explore our journey through the lens. Each image represents a moment 
                        preserved with professional care and artistic vision.
                    </motion.p>
                </div>
            </section>

            <div className="py-24 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-4 mb-20"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-10 py-3 rounded-full text-[10px] font-bold transition-all uppercase tracking-[0.2em] border",
                                    activeCategory === cat
                                        ? "bg-studio-dark text-white border-studio-dark shadow-2xl scale-105"
                                        : "bg-white text-studio-dark/40 border-black/5 hover:border-studio-gold hover:text-studio-gold"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-32 glass rounded-[3rem] border-2 border-dashed border-black/5">
                            <Camera className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                            <h2 className="text-2xl font-serif font-bold text-gray-400">Capturing New Stories</h2>
                            <p className="text-gray-400 mt-2">No images found in this category at the moment.</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative break-inside-avoid group cursor-pointer overflow-hidden rounded-[2rem] bg-studio-dark shadow-lg hover:shadow-2xl transition-all"
                                        onClick={() => setSelectedImage(item.image_url)}
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.category}
                                            className="w-full h-auto opacity-90 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Maximize2 className="w-6 h-6" />
                                            </div>
                                            <div className="absolute bottom-8 left-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-gold">{item.category}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] bg-studio-dark/95 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-12"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors p-4"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                            >
                                <X className="w-10 h-10" />
                            </button>
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={selectedImage}
                                alt="Enlarged view"
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatePage>
    )
}

export default Portfolio
