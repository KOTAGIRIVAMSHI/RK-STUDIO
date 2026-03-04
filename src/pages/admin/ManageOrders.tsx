import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Camera, Loader2, Download, Package, CheckCircle, Clock } from 'lucide-react';
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
    customer_id: string;
    customer_email: string;
    total_price: number;
    status: 'pending' | 'paid' | 'printing' | 'ready' | 'delivered';
    items: OrderItem[];
}

const ManageOrders = () => {
    const [orders, setOrders] = useState<PrintOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('print_orders' as any)
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data as PrintOrder[]);
        }
        setLoading(false);
    };

    const updateOrderStatus = async (id: string, newStatus: PrintOrder['status']) => {
        await ((supabase.from('print_orders') as any).update({ status: newStatus }) as any).eq('id', id);

        // Notification logic for when the order is ready
        if (newStatus === 'ready') {
            const order = orders.find(o => o.id === id);
            if (order && order.customer_email) {
                // Call our `notify-order` Edge Function
                await supabase.functions.invoke('notify-order', {
                    body: {
                        to: order.customer_email,
                        subject: 'Your Prints Are Ready! 📸',
                        html: `<p>Hi there,</p><p>Good news! Your order <strong>#${id.slice(0, 8)}</strong> has been printed and is ready for pickup at Shree RK Studio.</p>`,
                    }
                });
            }
        }

        fetchOrders();
    };

    const handleDownloadAll = async (items: OrderItem[]) => {
        for (const item of items) {
            const { data, error } = await supabase.storage
                .from('customer-uploads')
                .download(item.fileName);

            if (error) {
                console.error('Error downloading:', error);
                continue;
            }

            // Trigger browser download
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.fileName.split('/').pop() || 'photo.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const getStatusColor = (status: PrintOrder['status']) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'paid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready': return 'bg-green-100 text-green-800 border-green-200';
            case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
            <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
        </div>
    );

    return (
        <AnimatePage>
            <div className="py-24 md:py-32 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-20">
                        <span className="section-tag">Order Fufillment</span>
                        <h1 className="text-5xl font-serif font-bold text-studio-dark">Print <span className="text-studio-gold italic">Orders</span></h1>
                    </header>

                    <div className="space-y-10">
                        <AnimatePresence mode='popLayout'>
                            {orders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card !p-32 text-center border-2 border-dashed border-black/5"
                                >
                                    <Camera className="w-20 h-20 text-studio-gold/10 mx-auto mb-8" />
                                    <h2 className="text-2xl font-serif font-bold text-gray-400">No Orders Yet</h2>
                                    <p className="text-gray-400 mt-2 font-sans tracking-wide">When customers place print orders, they will appear here.</p>
                                </motion.div>
                            ) : (
                                orders.map((order, i) => (
                                    <motion.div
                                        layout
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="premium-card !p-8 shadow-xl relative overflow-hidden bg-white"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-8 justify-between">
                                            {/* Order Info */}
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Order #{order.id.slice(0, 8)}</span>
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="mb-6">
                                                    <h3 className="text-2xl font-serif font-bold text-studio-dark mb-1">
                                                        {order.customer_email || 'Unknown Customer'}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="bg-studio-neutral rounded-2xl p-6 border border-black/5">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Items to Print</h4>
                                                    <ul className="space-y-3">
                                                        {order.items.map((item, idx) => (
                                                            <li key={idx} className="flex flex-col gap-1 border-b border-black/5 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0 text-sm font-sans">
                                                                <div className="flex justify-between">
                                                                    <span className="text-studio-dark font-bold">{item.quantity}x — {item.size} Print</span>
                                                                    <span className="text-gray-400 font-bold">₹{item.quantity * item.unitPrice}</span>
                                                                </div>
                                                                <div className="flex gap-3 text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                                                                    <span>Finish: <span className="text-studio-gold capitalize">{item.finish || 'Glossy'}</span></span>
                                                                    <span className="px-2 border-l border-black/10">Effect: <span className="text-studio-gold capitalize">{item.effect || 'Original'}</span></span>
                                                                    <span className="px-2 border-l border-black/10">Border: <span className="text-studio-gold capitalize">{item.border || 'None'}</span></span>
                                                                    <span className="px-2 border-l border-black/10">Frame: <span className="text-studio-gold capitalize">{item.frame || 'None'}</span></span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center text-lg font-serif font-bold text-studio-gold">
                                                        <span>Total Paid</span>
                                                        <span>₹{order.total_price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-4 lg:w-64 lg:border-l lg:border-black/5 lg:pl-8">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Actions</h4>

                                                <button
                                                    onClick={() => handleDownloadAll(order.items)}
                                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest bg-studio-neutral text-studio-dark hover:bg-studio-gold hover:text-white transition-all"
                                                >
                                                    <Download className="w-4 h-4" /> Download Photos
                                                </button>

                                                {(order.status === 'pending' || order.status === 'paid') && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'printing')}
                                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        <Package className="w-4 h-4" /> Start Printing
                                                    </button>
                                                )}

                                                {order.status === 'printing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'ready')}
                                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Mark as Ready
                                                    </button>
                                                )}

                                                {order.status === 'ready' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white transition-all"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Mark Delivered
                                                    </button>
                                                )}

                                                {(order.status === 'pending' || order.status === 'paid' || order.status === 'printing' || order.status === 'ready') && (
                                                    <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                                                        Update status to notify customer via dashboard.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AnimatePage>
    );
};

export default ManageOrders;
