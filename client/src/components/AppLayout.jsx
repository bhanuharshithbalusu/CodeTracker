import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Code2, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-100">
                <Link to="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Code2 className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">CodeTracker</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150
                                ${active
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                        {user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-500 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-60 lg:w-64 flex-col bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center px-4">
                <button onClick={() => setMobileOpen(true)} className="p-1.5 -ml-1 rounded-lg hover:bg-slate-100">
                    <Menu className="w-5 h-5 text-slate-700" />
                </button>
                <div className="flex items-center gap-2 ml-3">
                    <Code2 className="w-5 h-5 text-slate-900" />
                    <span className="font-bold text-slate-900">CodeTracker</span>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 inset-y-0 w-64 bg-white flex flex-col shadow-xl animate-slide-in-right">
                        <div className="absolute right-3 top-3">
                            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-60 lg:ml-64 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
