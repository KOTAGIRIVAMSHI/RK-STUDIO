import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';
import { Upload, Camera, Image as ImageIcon, X, Loader2, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCustomerAuth } from '../../features/auth/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { removeBackground } from '@imgly/background-removal';

interface ProcessedImage {
    id: string;
    original: string;
    processed: string | null;
    file: File;
    isProcessed: boolean;
}

const PRICING_TIERS = [
    { quantity: 8, price: 170, perPhoto: 21.25 },
    { quantity: 12, price: 220, perPhoto: 18.33 },
    { quantity: 16, price: 260, perPhoto: 16.25 },
    { quantity: 20, price: 290, perPhoto: 14.50 },
    { quantity: 24, price: 315, perPhoto: 13.13 },
    { quantity: 28, price: 335, perPhoto: 11.96 },
    { quantity: 32, price: 350, perPhoto: 10.94 },
];

const PassportPhotos = () => {
    const { user } = useCustomerAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [uploadedImages, setUploadedImages] = useState<ProcessedImage[]>([]);
    const [processing, setProcessing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [processingError, setProcessingError] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[0]);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addImages(files);
    };

    const addImages = (files: File[]) => {
        const newImages: ProcessedImage[] = files.slice(0, 32 - uploadedImages.length).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            original: URL.createObjectURL(file),
            processed: null,
            file,
            isProcessed: false,
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    const processImage = async (image: ProcessedImage) => {
        setProcessing(true);
        setProcessingId(image.id);
        setProcessingError(null);

        try {
            // Remove background using client-side ML (no API key needed)
            const resultBlob = await removeBackground(image.file);

            // Render onto a white 600x600 passport canvas
            const passportDataUrl = await compositeOnWhiteCanvas(resultBlob);

            setUploadedImages(prev => prev.map(img =>
                img.id === image.id
                    ? { ...img, processed: passportDataUrl, isProcessed: true }
                    : img
            ));
        } catch (err: any) {
            console.error('Processing error:', err);
            setProcessingError(err.message || 'Failed to process image. Check browser console for details.');
        } finally {
            setProcessing(false);
            setProcessingId(null);
        }
    };

    const compositeOnWhiteCanvas = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                // Standard Indian passport size: 3.5cm x 4.5cm
                // At 300 DPI: roughly 413 x 531 pixels
                const WIDTH = 413;
                const HEIGHT = 531;

                const canvas = document.createElement('canvas');
                canvas.width = WIDTH;
                canvas.height = HEIGHT;
                const ctx = canvas.getContext('2d')!;

                // White background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                // Scale image to fill 90% of the narrower dimension, keeping aspect ratio
                // Typical passport framing requires shoulders + full head
                const scale = Math.min((WIDTH * 0.95) / img.width, (HEIGHT * 0.9) / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const x = (WIDTH - w) / 2;
                // Position slightly lower than center to leave headroom
                const y = (HEIGHT - h) / 1.1;

                ctx.drawImage(img, x, y, w, h);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const removeBackgroundSimple = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Set to US passport size 2x2 inches (300 DPI)
                canvas.width = 600;
                canvas.height = 600;
                const ctx = canvas.getContext('2d')!;

                // Fill white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Calculate dimensions to fill with aspect ratio
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                resolve(canvas.toDataURL('image/png'));
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleSubmitOrder = async () => {
        if (!user || uploadedImages.length === 0) return;

        const processedImages = uploadedImages.filter(img => img.processed);
        if (processedImages.length === 0) {
            setError('Please process at least one image with Gemini first');
            setOrderStatus('error');
            return;
        }

        setOrderStatus('uploading');
        setError(null);

        try {
            // Upload processed images to storage
            const uploadPromises = processedImages.map(async (img) => {
                const fileExt = 'png';
                const fileName = `${user.uid}/passport/${Date.now()}-${img.id}.${fileExt}`;

                // Convert base64 to blob
                const response = await fetch(img.processed!);
                const blob = await response.blob();

                const { error: uploadError } = await supabase.storage
                    .from('customer-uploads')
                    .upload(fileName, blob);

                if (uploadError) throw uploadError;
                return { fileName, quantity: selectedTier.quantity };
            });

            const uploadedFiles = await Promise.all(uploadPromises);

            // Save order to database
            const { error: orderError } = await supabase
                .from('print_orders')
                .insert({
                    customer_id: user.uid,
                    customer_email: user.email,
                    total_price: selectedTier.price,
                    items: uploadedFiles.map(f => ({
                        fileName: f.fileName,
                        size: 'passport',
                        finish: 'glossy',
                        effect: 'studio',
                        border: 'none',
                        frame: 'none',
                        quantity: f.quantity,
                        unitPrice: selectedTier.price / uploadedFiles.length
                    })),
                    status: 'pending'
                } as any);

            if (orderError) throw orderError;

            setOrderStatus('success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err: any) {
            console.error('Order error:', err);
            setError(err.message || 'Failed to submit order');
            setOrderStatus('error');
        }
    };

    return (
        <AnimatePage>
            <div className="min-h-screen py-16 sm:py-24 md:py-32 bg-studio-neutral">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="section-tag"
                        >
                            Quick & Professional
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-studio-dark mb-4"
                        >
                            Passport <span className="text-studio-gold italic">Photos</span>
                        </motion.h1>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Upload your photo and get studio-quality passport pictures with AI-enhanced background removal.
                        </p>
                    </div>

                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card !p-8 mb-8"
                    >
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-studio-neutral rounded-2xl hover:bg-studio-gold hover:text-white transition-all font-bold uppercase tracking-[0.1em] text-xs"
                            >
                                <ImageIcon className="w-5 h-5" /> Choose from Gallery
                            </button>
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-studio-neutral rounded-2xl hover:bg-studio-gold hover:text-white transition-all font-bold uppercase tracking-[0.1em] text-xs"
                            >
                                <Camera className="w-5 h-5" /> Take Photo
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={cameraInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                capture="environment"
                                multiple
                                className="hidden"
                            />
                        </div>

                        {uploadedImages.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-black/5 rounded-2xl">
                                <Upload className="w-12 h-12 text-studio-gold/20 mx-auto mb-4" />
                                <p className="text-gray-400 text-sm">
                                    Upload a clear, front-facing photo<br />
                                    We'll remove the background and make it studio-quality
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <AnimatePresence>
                                    {uploadedImages.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-inner"
                                        >
                                            <img
                                                src={img.processed || img.original}
                                                alt="Processed"
                                                className="w-full h-full object-contain bg-white"
                                            />
                                            {processingId === img.id && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {!img.processed && (
                                                <button
                                                    onClick={() => processImage(img)}
                                                    disabled={processing && processingId === img.id}
                                                    className="absolute bottom-2 left-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[8px] font-bold uppercase rounded-full flex items-center gap-1 hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                                                >
                                                    {processingId === img.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-3 h-3" />
                                                    )}
                                                    Remove BG
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>

                    {/* Processing Error */}
                    {processingError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm"
                        >
                            <strong>Gemini Error:</strong> {processingError}
                        </motion.div>
                    )}

                    {/* Pricing Section */}
                    {uploadedImages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-card !p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="w-6 h-6 text-studio-gold" />
                                <h2 className="text-xl font-serif font-bold">Select Quantity</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                                {PRICING_TIERS.map((tier) => (
                                    <button
                                        key={tier.quantity}
                                        onClick={() => setSelectedTier(tier)}
                                        className={`p-4 rounded-2xl border-2 transition-all ${selectedTier.quantity === tier.quantity
                                            ? 'border-studio-gold bg-studio-gold/5'
                                            : 'border-black/5 hover:border-studio-gold/50'
                                            }`}
                                    >
                                        <div className="text-2xl font-serif font-bold text-studio-dark">{tier.quantity}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-400">photos</div>
                                        <div className="text-lg font-bold text-studio-gold mt-1">₹{tier.price}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-studio-neutral rounded-2xl p-6 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Photos per image</span>
                                    <span className="font-bold">{selectedTier.quantity} x {uploadedImages.length} = {selectedTier.quantity * uploadedImages.length} prints</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Per photo price</span>
                                    <span className="font-bold">₹{selectedTier.perPhoto.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                                    <span className="font-bold text-gray-500">Total</span>
                                    <span className="text-3xl font-serif font-bold text-studio-gold">₹{selectedTier.price}</span>
                                </div>
                            </div>

                            {orderStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-center mb-4"
                                >
                                    <Check className="w-6 h-6 inline mr-2" />
                                    Order submitted successfully! Redirecting...
                                </motion.div>
                            )}

                            {orderStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center mb-4"
                                >
                                    {error || 'Failed to submit order. Please try again.'}
                                </motion.div>
                            )}

                            <button
                                onClick={handleSubmitOrder}
                                disabled={orderStatus === 'uploading' || !user}
                                className="w-full btn-primary !h-14 group"
                            >
                                {orderStatus === 'uploading' ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Order...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        Submit Order <Sparkles className="w-4 h-4" />
                                    </div>
                                )}
                            </button>

                            {!user && (
                                <p className="mt-4 text-center text-gray-400 text-xs">
                                    Please login to place an order
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatePage>
    );
};

export default PassportPhotos;
