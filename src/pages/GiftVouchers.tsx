import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'
import { useCart } from '../features/cart/CartContext'
import { Gift, Check, Heart, Star, Mail } from 'lucide-react'

const vouchers = [
    { id: 'v500', name: 'Gift Voucher ₹500', price: 500, description: 'Perfect for passport photos or small prints', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
    { id: 'v1000', name: 'Gift Voucher ₹1000', price: 1000, description: 'Great for portrait sessions or photo prints', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800' },
    { id: 'v2500', name: 'Gift Voucher ₹2500', price: 2500, description: 'Ideal for family portraits or photo album', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800' },
    { id: 'v5000', name: 'Gift Voucher ₹5000', price: 5000, description: 'Perfect for maternity or birthday shoot', image: 'https://images.unsplash.com/photo-1623253549221-fda29de68997?auto=format&fit=crop&q=80&w=800' },
    { id: 'v10000', name: 'Gift Voucher ₹10000', price: 10000, description: 'Great for half-day event coverage', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
    { id: 'v25000', name: 'Gift Voucher ₹25000', price: 25000, description: 'Full wedding coverage package', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800' },
]

const GiftVouchers = () => {
    const { addItem } = useCart()
    const [purchased, setPurchased] = useState(false)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    }

    const handleAddToCart = (voucher: typeof vouchers[0]) => {
        addItem({
            id: voucher.id,
            name: voucher.name,
            price: formatPrice(voucher.price),
            image: voucher.image,
            type: 'voucher'
        })
        setPurchased(true)
        setTimeout(() => setPurchased(false), 2000)
    }

    return (
        <AnimatePage>
            <section className="relative min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000" alt="Gift Vouchers" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center px-4 pt-16 sm:pt-24 md:pt-32">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-studio-gold text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Gift Cards</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-3 sm:mb-4">Gift Vouchers</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/60 mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
                        Give the gift of beautiful memories. Perfect for any occasion.
                    </motion.p>
                </div>
            </section>

            <section className="py-12 sm:py-16 md:py-24 bg-studio-neutral">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vouchers.map((voucher, i) => (
                            <motion.div
                                key={voucher.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="premium-card !p-0 overflow-hidden flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={voucher.image} alt={voucher.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-studio-dark/60 to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <div className="w-12 h-12 rounded-full bg-studio-gold/20 backdrop-blur-sm flex items-center justify-center">
                                            <Gift className="w-6 h-6 text-studio-gold" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="font-serif font-bold text-2xl mb-2">{voucher.name}</h3>
                                    <p className="text-gray-500 text-sm mb-6 flex-1">{voucher.description}</p>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-3xl font-serif font-bold text-studio-gold">{formatPrice(voucher.price)}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToCart(voucher)}
                                        className="w-full btn-primary flex items-center justify-center gap-2"
                                    >
                                        {purchased ? <Check className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                                        {purchased ? 'Added to Cart' : 'Add to Cart'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Gift className="w-16 h-16 text-studio-gold mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold mb-4">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div>
                                <div className="w-12 h-12 rounded-full bg-studio-gold/10 flex items-center justify-center mx-auto mb-4 text-studio-gold font-bold text-xl">1</div>
                                <h3 className="font-bold mb-2">Choose a Voucher</h3>
                                <p className="text-sm text-gray-500">Select the perfect gift voucher value for your needs</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-full bg-studio-gold/10 flex items-center justify-center mx-auto mb-4 text-studio-gold font-bold text-xl">2</div>
                                <h3 className="font-bold mb-2">Add to Cart</h3>
                                <p className="text-sm text-gray-500">Purchase securely online and receive via email</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-full bg-studio-gold/10 flex items-center justify-center mx-auto mb-4 text-studio-gold font-bold text-xl">3</div>
                                <h3 className="font-bold mb-2">Gift to Loved Ones</h3>
                                <p className="text-sm text-gray-500">The recipient can redeem it for any service</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AnimatePage>
    )
}

export default GiftVouchers
