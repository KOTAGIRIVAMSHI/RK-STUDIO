import { Link, useLocation } from 'react-router-dom'
import { Camera, Menu, X, User, Shield, ShoppingCart, Gift, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useCustomerAuth } from '../features/auth/CustomerAuthContext'
import { useCart } from '../features/cart/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const { user } = useCustomerAuth()
    const { totalItems } = useCart()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Contact', path: '/contact' },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                scrolled ? "py-4" : "py-8"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={cn(
                    "glass rounded-full px-8 py-4 flex justify-between items-center transition-all duration-500",
                    scrolled ? "shadow-2xl border-white/40" : "bg-transparent border-transparent shadow-none"
                )}>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-studio-gold rounded-full flex items-center justify-center text-white transition-transform group-hover:rotate-[360deg] duration-700">
                            <Camera className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-lg font-serif font-bold tracking-tight leading-none transition-colors",
                                scrolled || !location.pathname.includes('/') ? "text-studio-dark" : "text-white"
                            )}>Shree RK</span>
                            <span className={cn(
                                "text-[10px] font-sans tracking-[0.3em] uppercase opacity-60",
                                scrolled || !location.pathname.includes('/') ? "text-studio-dark" : "text-white"
                            )}>Studio</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "nav-link relative",
                                    (scrolled || location.pathname !== '/') ? "text-studio-dark/60" : "text-white/60",
                                    isActive(link.path) && "!text-studio-gold"
                                )}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 right-0 h-px bg-studio-gold"
                                    />
                                )}
                            </Link>
                        ))}

                        <div className="h-4 w-px bg-black/5" />

                        {user ? (
                            <Link to="/dashboard" className="flex items-center gap-2 text-studio-gold font-bold text-[10px] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                                <User className="w-3 h-3" />
                                Portal
                            </Link>
                        ) : (
                            <Link to="/login" className="btn-primary !px-6 !py-2.5 !text-[9px]">
                                Login
                            </Link>
                        )}

                        <Link
                            to="/admin/login"
                            className={cn(
                                "hover:text-studio-gold transition-colors text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100",
                                scrolled || location.pathname !== '/' ? "text-studio-dark" : "text-white"
                            )}
                        >
                            <Shield className="w-3 h-3" />
                        </Link>

                        <Link
                            to="/cart"
                            className={cn(
                                "relative p-2 hover:text-studio-gold transition-colors",
                                scrolled || location.pathname !== '/' ? "text-studio-dark" : "text-white"
                            )}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-studio-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "p-2 transition-colors",
                                scrolled || location.pathname !== '/' ? "text-studio-dark" : "text-white"
                            )}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-studio-neutral p-6 md:hidden flex flex-col justify-center items-center text-center"
                    >
                        <div className="space-y-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "block text-3xl font-serif font-bold uppercase tracking-wider",
                                        isActive(link.path) ? "text-studio-gold" : "text-studio-dark"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-8 space-y-4">
                                <Link
                                    to={user ? "/dashboard" : "/login"}
                                    onClick={() => setIsOpen(false)}
                                    className="btn-primary block w-full text-center"
                                >
                                    {user ? "Customer Dashboard" : "Login / Register"}
                                </Link>
                                <Link
                                    to="/admin/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 block"
                                >
                                    Admin Access
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
