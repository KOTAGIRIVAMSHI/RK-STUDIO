import { useState, useRef } from 'react';
import { useCustomerAuth } from '../../features/auth/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Minus, Image as ImageIcon, Calculator, CheckCircle2, AlertCircle, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';

interface PrintItem {
    id: string;
    file: File;
    preview: string;
    size: string;
    finish: 'glossy' | 'matte' | 'luster';
    effect: 'original' | 'bw' | 'sepia';
    border: 'none' | 'white';
    frame: 'none' | 'black' | 'white' | 'wood' | 'gold';
    quantity: number;
    price: number;
}

const PRINT_SIZES = [
    { label: '4" x 6"', value: '4x6', price: 15 },
    { label: '5" x 7"', value: '5x7', price: 25 },
    { label: '6" x 8"', value: '6x8', price: 35 },
    { label: '8" x 10"', value: '8x10', price: 60 },
    { label: '10" x 12"', value: '10x12', price: 100 },
    { label: '12" x 15"', value: '12x15', price: 150 },
];

const OrderPrints = () => {
    const { user } = useCustomerAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState<PrintItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + items.length > 100) {
            alert('Maximum 100 images allowed per order.');
            return;
        }

        const newItems: PrintItem[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            size: '4x6',
            finish: 'glossy',
            effect: 'original',
            border: 'none',
            frame: 'none',
            quantity: 1,
            price: 15
        }));

        setItems([...items, ...newItems]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, updates: Partial<PrintItem>) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, ...updates };
                if (updates.size || updates.frame !== undefined) {
                    const basePrice = PRINT_SIZES.find(s => s.value === updatedItem.size)?.price || 0;
                    const framePrice = updatedItem.frame !== 'none' ? 250 : 0;
                    updatedItem.price = basePrice + framePrice;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmitOrder = async () => {
        if (!user) return;
        setUploading(true);
        setStatus('idle');

        try {
            const uploadPromises = items.map(async (item) => {
                const fileExt = item.file.name.split('.').pop();
                const fileName = `${user.uid}/${Date.now()}-${item.id}.${fileExt}`;
                const { error: uploadError } = await (supabase.storage
                    .from('customer-uploads')
                    .upload(fileName, item.file) as any);

                if (uploadError) throw uploadError;
                return { ...item, fileName };
            });

            const uploadedItems = await Promise.all(uploadPromises);

            const { error: orderError } = await (supabase
                .from('print_orders' as any)
                .insert({
                    customer_id: user.uid,
                    customer_email: user.email,
                    total_price: totalPrice,
                    items: uploadedItems.map(item => ({
                        fileName: item.fileName,
                        size: item.size,
                        finish: item.finish,
                        effect: item.effect,
                        border: item.border,
                        frame: item.frame,
                        quantity: item.quantity,
                        unitPrice: item.price
                    })),
                    status: 'pending'
                } as any) as any);

            if (orderError) throw orderError;

            setStatus('success');
            setItems([]);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err: any) {
            console.error('Order error:', err);
            setError(err?.message || err?.error_description || 'Failed to submit order. Please try again.');
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

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
                                Printing Service
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-serif font-bold text-studio-dark"
                            >
                                Tangible <span className="text-studio-gold italic">Memories</span>
                            </motion.h1>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary group"
                            >
                                <Upload className="w-4 h-4 inline-block mr-2" /> Select Photos
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                        </motion.div>
                    </div>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-card !p-32 text-center border-2 border-dashed border-black/5"
                        >
                            <ImageIcon className="w-24 h-24 text-studio-gold/10 mx-auto mb-10" />
                            <h2 className="text-3xl font-serif font-bold mb-4 text-studio-dark/40">No Images Selected</h2>
                            <p className="text-gray-400 max-w-sm mx-auto mb-12 font-sans leading-relaxed">
                                Upload your favorite shots and we'll bring them to life with professional grade printing.
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-outline !h-14 !px-12"
                            >
                                Browse Files
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-8">
                                <AnimatePresence mode='popLayout'>
                                    {items.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                            className="premium-card !p-6 flex flex-col sm:flex-row gap-8 items-center"
                                        >
                                            <div
                                                className={`w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300
                                                    ${item.frame === 'black' ? 'bg-[#1a1a1a] p-3 shadow-2xl' : ''}
                                                    ${item.frame === 'white' ? 'bg-[#fcfcfc] p-3 shadow-2xl border border-gray-200' : ''}
                                                    ${item.frame === 'wood' ? 'bg-[#8b5a2b] p-3 shadow-2xl border-4 border-[#5c3a21]' : ''}
                                                    ${item.frame === 'gold' ? 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 p-3 shadow-2xl border border-yellow-700' : ''}
                                                    ${item.frame === 'none' ? 'rounded-[1.5rem] bg-studio-neutral shadow-inner' : 'rounded-sm'}
                                                `}
                                            >
                                                <div className={`w-full h-full relative ${item.border === 'white' ? 'p-2 bg-white shadow-inner' : 'bg-studio-neutral'}`}>
                                                    <img
                                                        src={item.preview}
                                                        alt="Preview"
                                                        className={`w-full h-full object-cover transition-all duration-300
                                                            ${item.effect === 'bw' ? 'grayscale' : ''}
                                                            ${item.effect === 'sepia' ? 'sepia' : ''}
                                                        `}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-grow flex flex-col gap-6 w-full">
                                                <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Size</label>
                                                        <select
                                                            value={item.size}
                                                            onChange={(e) => updateItem(item.id, { size: e.target.value })}
                                                            className="w-full bg-studio-neutral border border-black/5 rounded-2xl px-4 py-2 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/20 appearance-none cursor-pointer"
                                                        >
                                                            {PRINT_SIZES.map(s => (
                                                                <option key={s.value} value={s.value}>{s.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Finish</label>
                                                        <select
                                                            value={item.finish}
                                                            onChange={(e) => updateItem(item.id, { finish: e.target.value as PrintItem['finish'] })}
                                                            className="w-full bg-studio-neutral border border-black/5 rounded-2xl px-4 py-2 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/20 appearance-none cursor-pointer"
                                                        >
                                                            <option value="glossy">Glossy</option>
                                                            <option value="matte">Matte</option>
                                                            <option value="luster">Luster</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Effect</label>
                                                        <select
                                                            value={item.effect}
                                                            onChange={(e) => updateItem(item.id, { effect: e.target.value as PrintItem['effect'] })}
                                                            className="w-full bg-studio-neutral border border-black/5 rounded-2xl px-4 py-2 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/20 appearance-none cursor-pointer"
                                                        >
                                                            <option value="original">Original</option>
                                                            <option value="bw">B&W</option>
                                                            <option value="sepia">Sepia</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Border</label>
                                                        <select
                                                            value={item.border}
                                                            onChange={(e) => updateItem(item.id, { border: e.target.value as PrintItem['border'] })}
                                                            className="w-full bg-studio-neutral border border-black/5 rounded-2xl px-4 py-2 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/20 appearance-none cursor-pointer"
                                                        >
                                                            <option value="none">Borderless</option>
                                                            <option value="white">White Border</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2 xl:col-span-1 border-t xl:border-t-0 xl:border-l border-black/5 pt-4 xl:pt-0 xl:pl-4">
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-studio-gold mb-2 ml-1">Frame (+₹250)</label>
                                                        <select
                                                            value={item.frame}
                                                            onChange={(e) => updateItem(item.id, { frame: e.target.value as PrintItem['frame'] })}
                                                            className="w-full bg-studio-neutral border border-studio-gold/20 rounded-2xl px-4 py-2 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/50 appearance-none cursor-pointer"
                                                        >
                                                            <option value="none">No Frame</option>
                                                            <option value="black">Classic Black</option>
                                                            <option value="white">Gallery White</option>
                                                            <option value="wood">Natural Wood</option>
                                                            <option value="gold">Regal Gold</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-3 bg-studio-neutral p-1.5 rounded-full border border-black/5">
                                                            <button
                                                                onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                                                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-studio-gold hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                                                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-studio-gold hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <span className="text-xl font-serif font-bold text-studio-gold hidden sm:block">
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="pl-4 pr-5 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <X className="w-3 h-3" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-8 rounded-[2rem] border-2 border-dashed border-black/5 text-gray-400 hover:text-studio-gold hover:border-studio-gold/20 transition-all font-bold uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-4 h-4" /> Add More Photos
                                </motion.button>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="lg:col-span-4">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="premium-card sticky top-32"
                                >
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-studio-gold/10 rounded-2xl flex items-center justify-center text-studio-gold">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold">Order Summary</h2>
                                    </div>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Prints</span>
                                            <span className="text-studio-dark font-bold font-serif">{items.length} Units</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estimated Price</span>
                                            <span className="text-studio-dark font-bold font-serif">₹{totalPrice}</span>
                                        </div>
                                        <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                                            <div>
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Total Payable</span>
                                                <span className="text-sm font-sans text-gray-300">Inc. GST</span>
                                            </div>
                                            <span className="text-4xl font-serif font-bold text-studio-gold">₹{totalPrice}</span>
                                        </div>
                                    </div>

                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="p-6 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-4 mb-8"
                                        >
                                            <CheckCircle2 className="w-6 h-6 shrink-0" />
                                            Order processed. Redirecting to your vault...
                                        </motion.div>
                                    )}

                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-start gap-4 mb-8"
                                        >
                                            <AlertCircle className="w-6 h-6 shrink-0" />
                                            {error || 'Processing failed. Please attempt again.'}
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={uploading || items.length === 0}
                                        className="w-full btn-primary disabled:opacity-50 !h-16 group"
                                    >
                                        {uploading ? (
                                            <div className="flex items-center justify-center gap-4">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Uploading Gallery...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-4">
                                                Submit Order <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                                            </div>
                                        )}
                                    </button>

                                    <p className="mt-8 text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed font-bold opacity-60">
                                        Order will be processed by studio. <br /> Payment at pickup.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AnimatePage>
    );
};

export default OrderPrints;
