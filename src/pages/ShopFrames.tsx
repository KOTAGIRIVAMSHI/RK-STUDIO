import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatePage from '../components/AnimatePage';
import { ShoppingBag, Check, X, MessageCircle, Ruler, Palette, Award, Clock, ShoppingCart } from 'lucide-react';
import { useCustomerAuth } from '../features/auth/CustomerAuthContext';
import { useCart } from '../features/cart/CartContext';
import { useNavigate } from 'react-router-dom';

const FRAME_PRODUCTS = [
    {
        id: 'f1',
        name: 'Standard Black Frame',
        desc: 'Plain black synthetic wood frame. Simple, elegant, and perfect for passport or family photos.',
        sizes: ['4" x 6"', '5" x 7"', '8" x 10"', '12" x 15"'],
        price: 'From ₹250',
        variants: ['Matte Black', 'Glossy Black', 'Textured Black'],
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f2',
        name: 'Teak Wood Finish Frame',
        desc: 'Traditional brown wood texture frame. Brings a warm and classic touch to your memories.',
        sizes: ['5" x 7"', '8" x 10"', '10" x 12"', '16" x 20"'],
        variants: ['Natural Teak', 'Dark Walnut', 'Honey Oak'],
        price: 'From ₹350',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f3',
        name: 'Traditional Gold Frame',
        desc: 'Classic gold design frame, popular for wedding photos and religious pictures.',
        sizes: ['8" x 10"', '12" x 15"', '16" x 20"', '20" x 24"'],
        variants: ['Antique Gold', 'Shiny Gold', 'Brushed Gold'],
        price: 'From ₹450',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f4',
        name: 'Plain White Frame',
        desc: 'Minimalist white frame with a clean border. Looks great on colored walls.',
        sizes: ['4" x 6"', '6" x 8"', '8" x 10"', '10" x 12"'],
        variants: ['Matte White', 'Glossy White', 'Off White'],
        price: 'From ₹250',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f5',
        name: 'Silver Metallic Frame',
        desc: 'Modern silver frame with metallic finish. Perfect for corporate and contemporary decor.',
        sizes: ['5" x 7"', '8" x 10"', '12" x 15"', '16" x 20"'],
        variants: ['Chrome Silver', 'Brushed Silver', 'Pearl Silver'],
        price: 'From ₹400',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f6',
        name: 'Embossed Designer Frame',
        desc: 'Intricate embossed patterns with royal finish. Ideal for grand portraits and ceremonies.',
        sizes: ['8" x 10"', '12" x 15"', '16" x 20"', '24" x 30"'],
        variants: ['Royal Embossed', 'Floral Pattern', 'Geometric Design'],
        price: 'From ₹600',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f7',
        name: 'Mirror Frame',
        desc: 'Two-in-one frame with mirror effect. Adds depth and functionality to any space.',
        sizes: ['6" x 6"', '8" x 8"', '10" x 10"', '12" x 12"'],
        variants: ['Round Mirror', 'Square Mirror', 'Octagon Mirror'],
        price: 'From ₹350',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f8',
        name: 'Collage Multi-Photo Frame',
        desc: 'Display multiple photos in one beautiful frame. Perfect for family and event collections.',
        sizes: ['6" x 18" (3 photos)', '12" x 24" (6 photos)', '18" x 24" (9 photos)'],
        variants: ['3-Photo', '6-Photo', '9-Photo'],
        price: 'From ₹500',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f9',
        name: 'Floating Acrylic Frame',
        desc: 'Modern floating acrylic frame with 3D effect. Premium look for modern homes.',
        sizes: ['8" x 10"', '10" x 14"', '12" x 18"', '16" x 20"'],
        variants: ['Clear Acrylic', 'Frosted Acrylic', 'Colored Acrylic'],
        price: 'From ₹550',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    },
    {
        id: 'f10',
        name: 'Rustic Wood Frame',
        desc: 'Handcrafted rustic wooden frame with natural textures. Perfect for vintage and farmhouse style.',
        sizes: ['5" x 7"', '8" x 10"', '12" x 15"', '16" x 20"'],
        variants: ['Distressed Wood', 'Reclaimed Wood', 'Barn Wood'],
        price: 'From ₹400',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800&h=600'
    }
];

const FRAME_STATS = [
    { icon: Award, number: '50+', label: 'Frame Styles' },
    { icon: Ruler, number: '100+', label: 'Size Options' },
    { icon: Palette, number: '25+', label: 'Color Finishes' },
    { icon: Clock, number: '24hr', label: 'Quick Delivery' },
]

const ShopFrames = () => {
    const { user } = useCustomerAuth();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [selectedFrame, setSelectedFrame] = useState<typeof FRAME_PRODUCTS[0] | null>(null);
    const [addedToCart, setAddedToCart] = useState<string | null>(null);

    const handleBuy = (frame: typeof FRAME_PRODUCTS[0]) => {
        addItem({
            id: frame.id,
            name: frame.name,
            price: frame.price,
            image: frame.image,
            type: 'frame',
            variant: frame.variants[0],
            size: frame.sizes[0]
        })
        setAddedToCart(frame.id)
        setTimeout(() => {
            setAddedToCart(null)
            setSelectedFrame(null)
        }, 1500)
    };

    const handleWhatsApp = (frame: typeof FRAME_PRODUCTS[0]) => {
        const message = `Hi! I'm interested in the "${frame.name}". Can you please share live samples? Sizes: ${frame.sizes.join(', ')}`;
        window.open(`https://wa.me/919866859567?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80&w=2000"
                        alt="Frames"
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
                        Retail Store
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-[1.1]"
                    >
                        Premium <span className="text-studio-gold italic">Frames</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Looking for the perfect physical frame for your existing photos? Browse our curated 
                        collection of high-quality, handcrafted frames in various standard and custom sizes.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-20 z-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="glass rounded-[3rem] p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {FRAME_STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-14 h-14 rounded-full bg-studio-gold/10 flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-6 h-6 text-studio-gold" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-serif font-bold text-studio-dark mb-1">{stat.number}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Frames Grid */}
            <section className="py-24 bg-studio-neutral">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="section-tag"
                        >
                            Our Collection
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-title text-4xl md:text-5xl"
                        >
                            Browse Frames
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FRAME_PRODUCTS.map((frame, idx) => (
                            <motion.div
                                key={frame.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedFrame(frame)}
                                className="premium-card group hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer !p-0"
                            >
                                <div className="h-48 sm:h-56 w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                                    <img
                                        src={frame.image}
                                        alt={frame.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-studio-gold">
                                        {frame.price}
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-lg font-serif font-bold text-studio-dark mb-2 line-clamp-1">{frame.name}</h3>
                                    <p className="text-gray-500 font-sans text-sm mb-3 line-clamp-2">
                                        {frame.desc}
                                    </p>
                                    <div className="mt-auto">
                                        <p className="text-xs text-gray-400">{frame.sizes.length} sizes • {frame.variants.length} variants</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-studio-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80&w=2000"
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
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Can't Find What You Need?
                        </h2>
                        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                            We also offer custom frames tailored to your specific requirements. 
                            Contact us for personalized options.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="btn-primary !px-8 !py-4">
                                Contact Us
                            </a>
                            <button 
                                onClick={() => handleWhatsApp({ id: 'custom', name: 'Custom Frame', sizes: ['Custom'], variants: ['Custom'], desc: '', price: 'Custom', image: '' } as any)}
                                className="btn-outline !px-8 !py-4 !text-white !border-white/30 hover:!bg-white hover:!text-studio-dark"
                            >
                                Request Custom Frame
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Frame Detail Modal */}
            <AnimatePresence>
                {selectedFrame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedFrame(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="relative">
                                <img
                                    src={selectedFrame.image}
                                    alt={selectedFrame.name}
                                    className="w-full h-64 object-cover rounded-t-2xl"
                                />
                                <button
                                    onClick={() => setSelectedFrame(null)}
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                >
                                    <X className="w-5 h-5 text-studio-dark" />
                                </button>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-serif font-bold text-studio-dark">{selectedFrame.name}</h3>
                                    <span className="text-lg font-bold text-studio-gold bg-studio-gold/10 px-4 py-1 rounded-full">{selectedFrame.price}</span>
                                </div>
                                <p className="text-gray-500 font-sans mb-6 leading-relaxed">
                                    {selectedFrame.desc}
                                </p>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Available Sizes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFrame.sizes.map(size => (
                                            <span key={size} className="px-4 py-2 rounded-xl border border-black/5 text-sm font-semibold text-studio-dark bg-gray-50 flex items-center gap-2">
                                                <Check className="w-3 h-3 text-studio-gold" /> {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Frame Variants</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFrame.variants.map(variant => (
                                            <span key={variant} className="px-4 py-2 rounded-xl border border-studio-gold/20 text-sm font-semibold text-studio-dark bg-studio-gold/5">
                                                {variant}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleWhatsApp(selectedFrame)}
                                        className="flex-1 btn-secondary !h-12 flex items-center justify-center gap-2 !bg-[#25D366] !text-white hover:!bg-[#20bd5a]"
                                    >
                                        <MessageCircle className="w-4 h-4" /> Get Live Samples
                                    </button>
                                    <button
                                        onClick={() => selectedFrame && handleBuy(selectedFrame)}
                                        className={`flex-1 btn-primary !h-12 flex items-center justify-center gap-2 ${addedToCart ? '!bg-green-500' : ''}`}
                                    >
                                        {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                                        {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePage>
    );
};

export default ShopFrames;
