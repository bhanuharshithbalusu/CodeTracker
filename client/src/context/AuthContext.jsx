import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('codetracker_token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/user/me');
            setUser(res.data);
        } catch {
            localStorage.removeItem('codetracker_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('codetracker_token', res.data.token);
        // Fetch full user profile
        const profile = await api.get('/user/me');
        setUser(profile.data);
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('codetracker_token', res.data.token);
        const profile = await api.get('/user/me');
        setUser(profile.data);
        return res.data;
    };

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { credential });
        localStorage.setItem('codetracker_token', res.data.token);
        const profile = await api.get('/user/me');
        setUser(profile.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('codetracker_token');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await api.get('/user/me');
            setUser(res.data);
        } catch {
            // silent fail
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
