import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../features/auth/CustomerAuthContext';
import { LogIn, Loader2, AlertCircle, Camera, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatePage from '../../components/AnimatePage';

const CustomerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useCustomerAuth();
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };

    return (
        <AnimatePage>
            {/* Hero Section */}
            <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=2000"
                        alt="Login"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/70 via-studio-dark/50 to-studio-neutral" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4 pt-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-studio-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block"
                    >
                        Customer Portal
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-[1.1]"
                    >
                        Welcome <span className="text-studio-gold italic">Back</span>
                    </motion.h1>
                </div>
            </section>

            <div className="py-16 bg-studio-neutral flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-studio-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-studio-gold/5 blur-[120px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-12">
                        <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 bg-studio-gold rounded-full flex items-center justify-center text-white transition-transform group-hover:rotate-[360deg] duration-700 shadow-lg">
                                <Camera className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-serif font-bold tracking-tight leading-none">Shree RK</div>
                                <div className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-40">Portal</div>
                            </div>
                        </Link>
                        <h1 className="text-4xl font-serif font-bold text-studio-dark mb-3">Welcome Back</h1>
                        <p className="text-gray-400 font-sans text-sm">Access your memories and manages your sessions.</p>
                    </div>

                    <div className="premium-card !p-12 relative overflow-hidden">
                        <form onSubmit={handleEmailLogin} className="space-y-8">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 ml-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !h-14 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In <LogIn className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-300">
                                <span className="bg-[#faf9f6] px-4">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full btn-outline !h-14 flex items-center justify-center gap-3 !border-black/5 hover:!border-studio-gold group"
                        >
                            <Chrome className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="opacity-60 group-hover:opacity-100 font-bold tracking-[0.2em] text-[10px] uppercase">Sign in with Google</span>
                        </button>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-400">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-studio-gold font-bold hover:underline transition-all">Create one here</Link>
                    </p>
                </motion.div>
            </div>
        </AnimatePage>
    );
};

export default CustomerLogin;
