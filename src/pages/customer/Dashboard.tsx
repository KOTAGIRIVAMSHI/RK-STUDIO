import { useState, useEffect } from 'react';
import { useCustomerAuth } from '../../features/auth/CustomerAuthContext';
import { supabase } from '../../lib/supabase';
import { Camera, LogOut, Package, CheckCircle, Clock, Image as ImageIcon, Upload, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';

interface OrderItem {
    fileName: string;
    size: string;
    finish?: string;
    effect?: string;
    border?: string;
    frame?: string;
    quantity: number;
    unitPrice: number;
}

interface PrintOrder {
    id: string;
    created_at: string;
    total_price: number;
    status: 'paid' | 'printing' | 'ready' | 'delivered';
    items: OrderItem[];
}

const CustomerDashboard = () => {
    const { user, signOut, loading: authLoading } = useCustomerAuth();
    const [orders, setOrders] = useState<PrintOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('print_orders' as any)
            .select('*')
            .eq('customer_id', user.uid)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as PrintOrder[]);
        }
        setLoadingOrders(false);
    };

    if (authLoading || loadingOrders) return (
        <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
            <Clock className="w-10 h-10 text-studio-gold animate-spin" />
        </div>
    );

    if (!user) return null;

    const cards = [
        {
            title: 'Order Prints',
            desc: 'Turn your digital memories into tactile art.',
            icon: Upload,
            link: '/order-prints',
            stat: 'Express Delivery',
            color: 'text-studio-gold'
        },
        {
            title: 'Your Gallery',
            desc: 'View and download your professional shoots.',
            icon: ImageIcon,
            link: '#',
            stat: '0 Collections',
            color: 'text-studio-gold'
        },
        {
            title: 'Portal Settings',
            desc: 'Manage your profile and communication.',
            icon: Settings,
            link: '#',
            stat: 'Verified Account',
            color: 'text-studio-gold'
        }
    ];

    return (
        <AnimatePage>
            <div className="min-h-screen py-32 bg-studio-neutral px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="section-tag"
                            >
                                Customer Portal
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-serif font-bold text-studio-dark"
                            >
                                Hello, <span className="text-studio-gold italic">{user.displayName || user.email?.split('@')[0]}</span>
                            </motion.h1>
                        </div>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => signOut()}
                            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-studio-gold transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </motion.button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                        {cards.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                            >
                                <Link to={card.link} className="premium-card group block h-full">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-14 h-14 bg-studio-gold/5 rounded-2xl flex items-center justify-center text-studio-gold group-hover:bg-studio-gold group-hover:text-white transition-all duration-500">
                                            <card.icon className="w-6 h-6" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-studio-gold group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold mb-3">{card.title}</h3>
                                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-sans">{card.desc}</p>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-studio-gold/50">{card.stat}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Orders Section */}
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="premium-card !p-20 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-studio-gold/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                            <Camera className="w-20 h-20 text-studio-gold/20 mx-auto mb-8" />
                            <h2 className="text-3xl font-serif font-bold mb-4">No Active Orders</h2>
                            <p className="text-gray-500 max-w-md mx-auto mb-12 font-sans leading-relaxed">
                                You haven't placed any print orders yet. Turn your digital memories into tactile art today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link to="/order-prints" className="btn-primary">
                                    Start Printing
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-serif font-bold text-studio-dark mb-8 flex items-center gap-4">
                                <div className="w-8 h-1 bg-studio-gold rounded-full" />
                                Order History
                            </h2>
                            <AnimatePresence mode='popLayout'>
                                {orders.map((order, i) => (
                                    <motion.div
                                        layout
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="premium-card !p-8 shadow-sm flex flex-col md:flex-row justify-between gap-8 border-l-4 border-l-studio-gold bg-white"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-studio-gold">
                                                    Order #{order.id.slice(0, 8)}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 capitalize bg-gray-50 px-3 py-1 rounded-full font-bold tracking-widest">
                                                    {order.status === 'paid' && <Clock className="w-3 h-3 text-yellow-500" />}
                                                    {order.status === 'printing' && <Package className="w-3 h-3 text-blue-500" />}
                                                    {(order.status === 'ready' || order.status === 'delivered') && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                    {order.status}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 font-sans leading-relaxed">
                                                Placed on {new Date(order.created_at).toLocaleDateString()}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm font-sans tracking-wide text-studio-dark">
                                                <ImageIcon className="w-4 h-4 text-studio-gold/50" />
                                                <strong>{order.items.length} Photos</strong> ordered
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-8">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Paid</span>
                                            <span className="text-3xl font-serif font-bold text-studio-dark">₹{order.total_price}</span>
                                            {order.status === 'ready' && (
                                                <span className="mt-4 text-[10px] bg-green-50 text-green-700 px-4 py-2 rounded-full uppercase tracking-widest font-bold">
                                                    Ready for Pickup!
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </AnimatePage>
    );
};

export default CustomerDashboard;
