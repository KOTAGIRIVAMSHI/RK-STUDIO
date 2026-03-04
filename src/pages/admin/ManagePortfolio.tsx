import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Loader2, Camera, X, Upload, Filter, Sparkles } from 'lucide-react'
import { Database } from '../../types/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatePage from '../../components/AnimatePage'

type PortfolioItem = Database['public']['Tables']['portfolio']['Row']

const ManagePortfolio = () => {
    const [items, setItems] = useState<PortfolioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [category, setCategory] = useState('Wedding')
    const [uploading, setUploading] = useState(false)

    const categories = ['Wedding', 'Passport', 'Event', 'Portrait']

    useEffect(() => {
        fetchPortfolio()
    }, [])

    const fetchPortfolio = async () => {
        const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false })
        setItems(data || [])
        setLoading(false)
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageFile) return

        setUploading(true)
        try {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `portfolio/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('studio-images')
                .upload(filePath, imageFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('studio-images')
                .getPublicUrl(filePath)

            // @ts-ignore - Supabase type inference issue
            await supabase.from('portfolio').insert([{
                category,
                image_url: publicUrl,
            }])

            fetchPortfolio()
            setIsModalOpen(false)
            setImageFile(null)
        } catch (error) {
            console.error('Error uploading to portfolio:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this portfolio item?')) {
            await supabase.from('portfolio').delete().eq('id', id)
            fetchPortfolio()
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
            <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
        </div>
    );

    return (
        <AnimatePage>
            <div className="py-24 md:py-32 bg-studio-neutral min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <span className="section-tag">Content Curation</span>
                            <h1 className="text-5xl font-serif font-bold text-studio-dark">Portfolio <span className="text-studio-gold italic">Gallery</span></h1>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center gap-3 group"
                        >
                            <Plus className="w-4 h-4" /> Upload New Work
                        </button>
                    </header>

                    <div className="columns-1 md:columns-3 lg:columns-4 gap-10 space-y-10">
                        <AnimatePresence mode='popLayout'>
                            {items.map((item, i) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative break-inside-avoid group rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all bg-white"
                                >
                                    <img src={item.image_url} alt={item.category} className="w-full h-auto opacity-95 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6">
                                        <div className="absolute bottom-8 left-8">
                                            <span className="text-[10px] text-studio-gold font-bold uppercase tracking-[0.3em] mb-1 block">Category</span>
                                            <span className="text-white font-serif font-bold text-lg">{item.category}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl flex items-center justify-center hover:scale-110 active:scale-90"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {isModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-studio-dark/80 backdrop-blur-xl"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-studio-gold/5 blur-[60px] rounded-full" />

                                    <div className="flex justify-between items-center mb-10 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-studio-gold/50" />
                                            <h2 className="text-3xl font-serif font-bold text-studio-dark">New Work</h2>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <X className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpload} className="space-y-8 relative z-10">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Portfolio Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-studio-neutral border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-studio-dark outline-none focus:ring-2 focus:ring-studio-gold/20 appearance-none cursor-pointer"
                                            >
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Photography File</label>
                                            <div
                                                className={`mt-1 flex flex-col items-center justify-center px-8 py-12 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer ${imageFile ? 'border-studio-gold bg-studio-gold/5' : 'border-black/5 bg-studio-neutral hover:border-studio-gold/30'}`}
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                <Upload className={`h-12 w-12 mb-4 ${imageFile ? 'text-studio-gold' : 'text-gray-200'}`} />
                                                <div className="text-center">
                                                    <span className="text-xs font-bold text-studio-dark mb-1 block">
                                                        {imageFile ? imageFile.name : 'Choose high-res image'}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Max 10MB • JPG or PNG</span>
                                                </div>
                                                <input id="file-upload" type="file" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploading || !imageFile}
                                            className="w-full btn-primary !h-16 flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    Processing Image...
                                                </>
                                            ) : (
                                                <>
                                                    Publish to Portfolio <Sparkles className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AnimatePage>
    )
}

export default ManagePortfolio
