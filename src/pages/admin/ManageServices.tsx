import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Edit2, Loader2, Camera, X, Upload, Sparkles, Clock, Tag } from 'lucide-react'
import { Database } from '../../types/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatePage from '../../components/AnimatePage'

type Service = Database['public']['Tables']['services']['Row']

const ManageServices = () => {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentService, setCurrentService] = useState<Partial<Service> | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false })
        setServices(data || [])
        setLoading(false)
    }

    const handleImageUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `services/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('studio-images')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('studio-images')
            .getPublicUrl(filePath)

        return publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)

        try {
            let imageUrl = currentService?.image_url

            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile)
            }

            const serviceData = {
                title: currentService?.title || '',
                description: currentService?.description || '',
                price: currentService?.price || '',
                turnaround_time: currentService?.turnaround_time || '',
                image_url: imageUrl,
            }

            if (currentService?.id) {
                // @ts-ignore - Supabase type inference issue
                await supabase.from('services').update(serviceData).eq('id', currentService.id)
            } else {
                // @ts-ignore - Supabase type inference issue
                await supabase.from('services').insert([serviceData])
            }

            fetchServices()
            setIsModalOpen(false)
            setCurrentService(null)
            setImageFile(null)
        } catch (error) {
            console.error('Error saving service:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await supabase.from('services').delete().eq('id', id)
            fetchServices()
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
                            <span className="section-tag">Value Definitions</span>
                            <h1 className="text-5xl font-serif font-bold text-studio-dark">Service <span className="text-studio-gold italic">Catalog</span></h1>
                        </div>
                        <button
                            onClick={() => { setCurrentService({}); setIsModalOpen(true); }}
                            className="btn-primary flex items-center gap-3"
                        >
                            <Plus className="w-4 h-4" /> Add New Offering
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <AnimatePresence mode='popLayout'>
                            {services.map((service, i) => (
                                <motion.div
                                    layout
                                    key={service.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="premium-card !p-0 overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={service.image_url || ''} alt={service.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[1.5s]" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-6 right-6 flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <button
                                                onClick={() => { setCurrentService(service); setIsModalOpen(true); }}
                                                className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white hover:bg-white hover:text-studio-dark transition-all flex items-center justify-center"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="w-10 h-10 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-full text-white hover:bg-red-500 transition-all flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-6 left-8">
                                            <span className="text-white font-serif font-bold text-2xl">{service.title}</span>
                                        </div>
                                    </div>
                                    <div className="p-10">
                                        <div className="flex flex-wrap gap-4 mb-8">
                                            <div className="flex items-center gap-2 bg-studio-neutral px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-studio-gold shadow-inner">
                                                <Tag className="w-3 h-3" /> {service.price}
                                            </div>
                                            <div className="flex items-center gap-2 bg-studio-neutral px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 shadow-inner">
                                                <Clock className="w-3 h-3" /> {service.turnaround_time}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed font-sans line-clamp-3 bg-studio-neutral/50 p-6 rounded-2xl border border-black/5">
                                            {service.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Modal */}
                    <AnimatePresence>
                        {isModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-studio-dark/80 backdrop-blur-xl"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 30 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 30 }}
                                    className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-studio-gold/5 blur-[100px] rounded-full" />

                                    <div className="flex justify-between items-center mb-12 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-studio-gold/10 rounded-2xl flex items-center justify-center text-studio-gold">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-3xl font-serif font-bold text-studio-dark">{currentService?.id ? 'Edit Offering' : 'New Service'}</h2>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                            <X className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10 px-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 ml-4">Service Identity</label>
                                                <input
                                                    required
                                                    value={currentService?.title || ''}
                                                    onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                                                    className="input-field py-5"
                                                    placeholder="e.g. Cinematic Wedding Photography"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 ml-4">Price Tag</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-gold/40" />
                                                    <input
                                                        value={currentService?.price || ''}
                                                        onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                                                        className="input-field pl-14 py-5"
                                                        placeholder="e.g. ₹25,000 onwards"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 ml-4">Processing Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-gold/40" />
                                                    <input
                                                        value={currentService?.turnaround_time || ''}
                                                        onChange={(e) => setCurrentService({ ...currentService, turnaround_time: e.target.value })}
                                                        className="input-field pl-14 py-5"
                                                        placeholder="e.g. 10 Working Days"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 ml-4">Detailed Description</label>
                                            <textarea
                                                value={currentService?.description || ''}
                                                onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                                                className="input-field h-40 resize-none py-6"
                                                placeholder="Outline the scope, deliverables, and unique value of this service..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 ml-4">Cover Visual</label>
                                            <div
                                                className={`flex flex-col items-center justify-center px-10 py-16 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer ${imageFile ? 'border-studio-gold bg-studio-gold/5' : 'border-black/5 bg-studio-neutral hover:border-studio-gold/30'}`}
                                                onClick={() => document.getElementById('service-img')?.click()}
                                            >
                                                <Camera className={`h-12 w-12 mb-6 ${imageFile ? 'text-studio-gold' : 'text-gray-200'}`} />
                                                <div className="text-center">
                                                    <span className="text-xs font-bold text-studio-dark mb-2 block">
                                                        {imageFile ? imageFile.name : 'Choose high-quality preview'}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Recommended: 16:9 • Under 10MB</span>
                                                </div>
                                                <input id="service-img" type="file" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="w-full btn-primary !h-16 flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    Saving Offering...
                                                </>
                                            ) : (
                                                <>
                                                    Update Catalog <Sparkles className="w-4 h-4" />
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

export default ManageServices
