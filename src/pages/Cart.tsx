import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'
import { useCart } from '../features/cart/CartContext'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
    const navigate = useNavigate()

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    }

    if (items.length === 0) {
        return (
            <AnimatePage>
                <section className="relative min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                    </div>
                    <div className="relative z-10 text-center px-4 pt-20 sm:pt-24 md:pt-32">
                        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-studio-gold text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Your Cart</motion.span>
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-3 sm:mb-4">Cart is Empty</motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">Looks like you haven't added anything to your cart yet.</motion.p>
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={() => navigate('/frames')} className="btn-primary !px-8 sm:!px-10">Browse Frames</motion.button>
                    </div>
                </section>
            </AnimatePage>
        )
    }

    return (
        <AnimatePage>
            <section className="relative min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center px-4 pt-16 sm:pt-24 md:pt-32">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-studio-gold text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Shopping Cart</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-3 sm:mb-4">Your Items</motion.h1>
                </div>
            </section>

            <section className="py-10 sm:py-16 bg-studio-neutral">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, i) => (
                                <motion.div
                                    key={`${item.id}-${item.variant}-${item.size}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="premium-card !p-0 flex gap-6"
                                >
                                    <div className="w-32 h-32 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-l-[2.5rem]" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">{item.variant && `Variant: ${item.variant}`} {item.size && ` | Size: ${item.size}`}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="font-bold w-8 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-bold text-studio-gold">{formatPrice(parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <button onClick={() => navigate('/frames')} className="flex items-center gap-2 text-studio-gold font-bold text-sm mt-4">
                                <ArrowLeft className="w-4 h-4" /> Continue Shopping
                            </button>
                        </div>

                        <div>
                            <div className="premium-card sticky top-32">
                                <h3 className="font-serif font-bold text-xl mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Items ({totalItems})</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-green-600 font-bold">Free</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-studio-gold">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                                <button className="w-full btn-primary flex items-center justify-center gap-2">
                                    Checkout <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-4">Secure payment powered by Razorpay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatePage>
    )
}

export default Cart
