import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatePage from '../components/AnimatePage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, Clock, Camera, MapPin, Phone, Mail, User, Check, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email'),
    service: z.string().min(1, 'Please select a service'),
    package: z.string().min(1, 'Please select a package'),
    date: z.string().min(1, 'Please select a date'),
    time: z.string().min(1, 'Please select a time'),
    location: z.string().min(1, 'Please select location'),
    notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const services = [
    { id: 'wedding', name: 'Wedding Photography', icon: '💒' },
    { id: 'portrait', name: 'Portrait Session', icon: '📸' },
    { id: 'event', name: 'Event Coverage', icon: '🎉' },
    { id: 'product', name: 'Product Photography', icon: '📦' },
    { id: 'maternity', name: 'Maternity Shoot', icon: '👶' },
    { id: 'birthday', name: 'Birthday Party', icon: '🎂' },
]

const packages = [
    { id: 'basic', name: 'Basic', price: 5000, hours: 2, deliverables: '50 edited photos, 1 photographer' },
    { id: 'standard', name: 'Standard', price: 10000, hours: 4, deliverables: '150 edited photos, 1 photographer, 1 album' },
    { id: 'premium', name: 'Premium', price: 25000, hours: 8, deliverables: '300 edited photos, 2 photographers, 2 albums, teaser video' },
    { id: 'luxury', name: 'Luxury', price: 50000, hours: 12, deliverables: 'Unlimited photos, 3 photographers, 3 albums, wedding film, drone coverage' },
]

const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

const Booking = () => {
    const [selectedService, setSelectedService] = useState('')
    const [selectedPackage, setSelectedPackage] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema)
    })

    const selectedServiceId = watch('service')

    const onSubmit = async (data: BookingFormData) => {
        console.log('Booking data:', data)
        setIsSubmitted(true)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    }

    if (isSubmitted) {
        return (
            <AnimatePage>
                <div className="min-h-screen bg-studio-neutral flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="premium-card text-center max-w-md"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-4">Booking Confirmed!</h2>
                        <p className="text-gray-500 mb-6">Thank you for your booking! Our team will contact you shortly to confirm the details.</p>
                        <div className="space-y-3">
                            <button onClick={() => navigate('/')} className="btn-primary w-full">Back to Home</button>
                            <button onClick={() => navigate('/contact')} className="btn-outline w-full">Contact Us</button>
                        </div>
                    </motion.div>
                </div>
            </AnimatePage>
        )
    }

    return (
        <AnimatePage>
            <section className="relative min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" alt="Booking" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center px-4 pt-16 sm:pt-24 md:pt-32">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-studio-gold text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Book a Session</motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-0 sm:mb-4">Book Your Shoot</motion.h1>
                </div>
            </section>

            <section className="py-10 sm:py-16 bg-studio-neutral">
                <div className="max-w-4xl mx-auto px-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card">
                            <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-studio-gold" /> Select Service
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {services.map(service => (
                                    <label
                                        key={service.id}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${selectedServiceId === service.id ? 'border-studio-gold bg-studio-gold/5' : 'border-black/5 hover:border-studio-gold/30'}`}
                                    >
                                        <input type="radio" value={service.id} {...register('service')} className="hidden" onChange={() => setSelectedService(service.id)} />
                                        <span className="text-2xl mb-2 block">{service.icon}</span>
                                        <span className="text-sm font-bold">{service.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.service && <p className="text-red-500 text-xs mt-2">{errors.service.message}</p>}
                        </motion.div>

                        {selectedServiceId && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card">
                                <h3 className="font-serif font-bold text-xl mb-6">Select Package</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {packages.map(pkg => (
                                        <label
                                            key={pkg.id}
                                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${watch('package') === pkg.id ? 'border-studio-gold bg-studio-gold/5' : 'border-black/5 hover:border-studio-gold/30'}`}
                                        >
                                            <input type="radio" value={pkg.id} {...register('package')} className="hidden" onChange={() => setSelectedPackage(pkg.id)} />
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-serif font-bold text-lg">{pkg.name}</span>
                                                <span className="text-studio-gold font-bold">{formatPrice(pkg.price)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{pkg.hours} hours</p>
                                            <p className="text-xs text-gray-400">{pkg.deliverables}</p>
                                        </label>
                                    ))}
                                </div>
                                {errors.package && <p className="text-red-500 text-xs mt-2">{errors.package.message}</p>}
                            </motion.div>
                        )}

                        {selectedPackage && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card">
                                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-studio-gold" /> Select Date & Time
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Date</label>
                                        <input type="date" {...register('date')} className="input-field" min={new Date().toISOString().split('T')[0]} />
                                        {errors.date && <p className="text-red-500 text-xs mt-2">{errors.date.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Time</label>
                                        <select {...register('time')} className="input-field">
                                            <option value="">Select time</option>
                                            {times.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.time && <p className="text-red-500 text-xs mt-2">{errors.time.message}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card">
                            <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-studio-gold" /> Your Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Full Name</label>
                                    <input {...register('name')} placeholder="Your name" className="input-field" />
                                    {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Phone Number</label>
                                    <input {...register('phone')} placeholder="+91 98765 43210" className="input-field" />
                                    {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Email</label>
                                    <input {...register('email')} placeholder="your@email.com" className="input-field" />
                                    {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Location</label>
                                    <select {...register('location')} className="input-field">
                                        <option value="">Select location</option>
                                        <option value="studio">At Studio (Serilingampally, Hyderabad)</option>
                                        <option value="home">At Home (Hyderabad)</option>
                                        <option value="venue">At Venue (Extra travel charges apply)</option>
                                    </select>
                                    {errors.location && <p className="text-red-500 text-xs mt-2">{errors.location.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Additional Notes (Optional)</label>
                                    <textarea {...register('notes')} rows={3} placeholder="Any special requirements..." className="input-field" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full btn-primary !py-5 text-sm"
                        >
                            Confirm Booking
                        </motion.button>
                    </form>
                </div>
            </section>
        </AnimatePage>
    )
}

export default Booking
