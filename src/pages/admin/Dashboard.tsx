import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Users,
    Image as ImageIcon,
    MessageSquare,
    TrendingUp,
    Camera,
    ArrowRight,
    Loader2,
    Calendar,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        services: 0,
        portfolio: 0,
        messages: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [services, portfolio, messages, orders] = await Promise.all([
                supabase.from('services').select('*', { count: 'exact', head: true }),
                supabase.from('portfolio').select('*', { count: 'exact', head: true }),
                supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
                supabase.from('print_orders' as any).select('*', { count: 'exact', head: true })
            ]);

            setStats({
                services: services.count || 0,
                portfolio: portfolio.count || 0,
                messages: messages.count || 0,
                orders: orders.count || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
            <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
        </div>
    );

    const statCards = [
        { label: 'Active Services', value: stats.services, icon: Star, color: 'text-amber-500' },
        { label: 'Portfolio Items', value: stats.portfolio, icon: ImageIcon, color: 'text-studio-gold' },
        { label: 'Client Messages', value: stats.messages, icon: MessageSquare, color: 'text-studio-gold' },
        { label: 'Print Orders', value: stats.orders, icon: Camera, color: 'text-amber-500' },
    ];

    const actions = [
        { title: 'Manage Services', desc: 'Update pricing and offerings', link: '/admin/services', icon: Star },
        { title: 'Update Portfolio', desc: 'Upload new photography works', link: '/admin/portfolio', icon: ImageIcon },
        { title: 'Print Orders', desc: 'Fulfill customer print requests', link: '/admin/orders', icon: Camera },
        { title: 'Client Inquiries', desc: 'Respond to contact messages', link: '/admin/messages', icon: MessageSquare },
    ];

    return (
        <AnimatePage>
            <div className="p-8 md:p-12 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <span className="section-tag">Internal Control Panel</span>
                            <h1 className="text-5xl font-serif font-bold text-studio-dark">Studio <span className="text-studio-gold italic">Insights</span></h1>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white px-6 py-3 rounded-full shadow-sm">
                            <Calendar className="w-3 h-3 text-studio-gold" />
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {statCards.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="premium-card !p-8 group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 bg-studio-neutral rounded-2xl flex items-center justify-center ${stat.color} transition-all duration-500 group-hover:scale-110`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-green-500/20" />
                                </div>
                                <div className="text-4xl font-serif font-bold mb-2">{stat.value}</div>
                                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-2xl font-serif font-bold text-studio-dark mb-8 flex items-center gap-4">
                                <div className="w-8 h-1 bg-studio-gold rounded-full" />
                                Management Suite
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {actions.map((action, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                    >
                                        <Link to={action.link} className="premium-card !p-8 group block h-full">
                                            <div className="w-12 h-12 bg-studio-gold/5 rounded-2xl flex items-center justify-center text-studio-gold mb-6 group-hover:bg-studio-gold group-hover:text-white transition-all duration-500">
                                                <action.icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-serif font-bold mb-2">{action.title}</h3>
                                            <p className="text-gray-400 text-sm mb-8 leading-relaxed font-sans">{action.desc}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-studio-gold group-hover:gap-4 transition-all">
                                                Access Module <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Order Feed / Recent Activity */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-serif font-bold text-studio-dark mb-8 flex items-center gap-4">
                                <div className="w-8 h-1 bg-studio-gold rounded-full" />
                                Live Feed
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="premium-card !p-8"
                            >
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 bg-studio-gold/5 rounded-full animate-ping absolute inset-0" />
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl relative z-10">
                                            <TrendingUp className="w-8 h-8 text-studio-gold" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-2">Steady Growth</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-sans px-4">
                                        The studio has seen a 12% increase in digital engagement this month.
                                        Keep the portfolio updated to maintain momentum.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatePage>
    );
};

export default AdminDashboard;
