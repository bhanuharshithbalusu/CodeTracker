import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Code2, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-in was cancelled or failed. Please try again.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 mt-4">Welcome back</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to your CodeTracker account</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Google Sign-In */}
                    <div className="flex justify-center mb-4">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            width="320"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-slate-400 font-medium">or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-slate-900 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
