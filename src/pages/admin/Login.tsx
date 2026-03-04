import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shield, Loader2, AlertCircle, Camera, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=2000"
                        alt="Admin"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-dark" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4 pt-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-studio-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block"
                    >
                        Admin Access
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-[1.1]"
                    >
                        Studio <span className="text-studio-gold italic">Manager</span>
                    </motion.h1>
                </div>
            </section>

            <div className="min-h-screen bg-studio-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-studio-gold/10 blur-[150px] rounded-full opacity-50" />
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 opacity-20">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Shree RK</span>
                    <span className="text-[8px] font-bold uppercase tracking-[1em] text-studio-gold">Internal Admin</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="text-center mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-studio-gold transition-colors text-[10px] font-bold uppercase tracking-[0.3em] mb-12 group">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Studio
                        </Link>

                        <div className="w-20 h-20 bg-studio-gold/20 rounded-3xl flex items-center justify-center text-studio-gold mx-auto mb-8 shadow-2xl border border-studio-gold/10">
                            <Shield className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-3">Studio Manager</h1>
                        <p className="text-white/30 font-sans text-sm tracking-wide">Enter your administrative credentials to proceed.</p>
                    </div>

                    <div className="glass !bg-white/5 !border-white/5 p-12 rounded-[2.5rem] shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 ml-2">Admin Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-studio-gold/20 focus:border-studio-gold outline-none transition-all duration-300 text-white text-sm"
                                    placeholder="admin@studio.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 ml-2">Security Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-studio-gold/20 focus:border-studio-gold outline-none transition-all duration-300 text-white text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !h-14 flex items-center justify-center gap-3 disabled:opacity-50 !bg-white !text-studio-dark hover:!bg-studio-gold hover:!text-white border-none"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Initialize Control'
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePage>
    );
};

export default AdminLogin;
