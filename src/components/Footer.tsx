import { Link } from 'react-router-dom';
import { Camera, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-studio-dark text-white pt-16 sm:pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-12 sm:mb-24">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-studio-gold rounded-full flex items-center justify-center text-white transition-transform group-hover:rotate-[360deg] duration-700">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xl font-serif font-bold tracking-tight leading-none text-white">Shree RK</span>
                                <span className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-40 text-white">Studio</span>
                            </div>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed mb-8">
                            Capturing the essence of your story with 24 years of artistic excellence and technical precision in Hyderabad.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-studio-gold hover:border-studio-gold transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-gold mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Services', 'Portfolio', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 bg-studio-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-gold mb-8">Specialties</h4>
                        <ul className="space-y-4">
                            {['Wedding Shoots', 'Passport Portraits', 'Event Coverage', 'Maternity Photography'].map((item) => (
                                <li key={item}>
                                    <span className="text-white/60 text-sm flex items-center gap-2">
                                        <div className="w-1 h-1 bg-studio-gold/30 rounded-full" />
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-gold mb-8">Reach Us</h4>
                        <ul className="space-y-6">
                            <li>
                                <a href="tel:+919866859567" className="flex gap-4 group">
                                    <Phone className="w-5 h-5 text-studio-gold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Call Us</div>
                                        <div className="text-sm">+91 9866859567</div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:shreerkstudio@gmail.com" className="flex gap-4 group">
                                    <Mail className="w-5 h-5 text-studio-gold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</div>
                                        <div className="text-sm">shreerkstudio@gmail.com</div>
                                    </div>
                                </a>
                            </li>
                            <li className="flex gap-4">
                                <MapPin className="w-5 h-5 text-studio-gold shrink-0 opacity-40" />
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Studio</div>
                                    <div className="text-sm leading-relaxed">Serilingampally, Hyderabad, <br />Telangana 500019</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/20 text-xs tracking-widest uppercase font-bold">
                        © {new Date().getFullYear()} Shree RK Photo Studio. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/admin/login" className="text-white/20 hover:text-studio-gold transition-colors text-[10px] uppercase tracking-widest font-bold">Admin Portal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
