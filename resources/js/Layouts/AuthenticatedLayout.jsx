import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Package, MapPin, Tag, FileWarning,
    Settings, Users, LogOut, Menu, Bell,
    ChevronRight, Cpu, Building2, FolderClosed, Warehouse, ShieldCheck, ScanLine, MoreHorizontal, X
} from 'lucide-react';

// ─── Static nav data ────────────────────────────────────────────────────────

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

const navItems = [
    { label: 'Dashboard',       href: '/dashboard',   icon: LayoutDashboard, routeName: 'dashboard' },
    { label: 'Scan QR',         href: '/scanner',     icon: ScanLine,        routeName: 'scanner.index' },
    { label: 'Aset',            href: '/assets',      icon: Cpu,             routeName: 'assets.index',
      action: <span className="bg-[hsl(var(--primary))] text-white p-0.5 rounded ml-auto flex items-center justify-center"><PlusIcon /></span> },
    { label: 'Peminjaman',      href: '/loans',       icon: Warehouse,       routeName: 'loans.index' },
    { label: 'Consumable',      href: '/consumables', icon: Package,         routeName: 'consumables.index' },
    { label: 'Laporan Kendala', href: '/reports',     icon: FileWarning,     routeName: 'reports.index' },
];

const masterDataItems = [
    { label: 'Kategori', href: '/categories', routeName: 'categories.index', icon: Tag },
    { label: 'Lokasi',   href: '/locations',  routeName: 'locations.index',  icon: MapPin },
];

const adminNavItems = [
    { label: 'Manajemen User', href: '/users',    routeName: 'users.index',    icon: Users },
    { label: 'Manajemen Role', href: '/roles',    routeName: 'roles.index',    icon: ShieldCheck },
    { label: 'Pengaturan',     href: '/settings', routeName: 'settings.index', icon: Settings },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavItem({ item, currentUrl, collapsed }) {
    const searchParams = new URLSearchParams(window.location.search);
    const hasLocationFilter = currentUrl.startsWith('/assets') && searchParams.has('location_id');
    const isActive = item.href && currentUrl.startsWith(item.href) && !hasLocationFilter;

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                    ? 'bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`} />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.action && (
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.visit(item.href + '/create'); }}>
                    {item.action}
                </div>
            )}
        </Link>
    );
}

function FolderGroup({ title, items, currentUrl, collapsed, defaultOpen = false }) {
    const storageKey = `folder-group-open-${title}`;
    const [open, setOpen] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) return stored === 'true';
        if (items.some(child => currentUrl.startsWith(child.href))) return true;
        return defaultOpen;
    });

    const isActive = items.some(child => currentUrl.startsWith(child.href));

    useEffect(() => {
        if (isActive) {
            setOpen(true);
            localStorage.setItem(storageKey, 'true');
        }
    }, [isActive, storageKey]);

    const toggleOpen = () => {
        setOpen(prev => {
            const next = !prev;
            localStorage.setItem(storageKey, String(next));
            return next;
        });
    };

    return (
        <div className="mt-6">
            {!collapsed && (
                <button
                    onClick={toggleOpen}
                    className="w-full flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider group transition-colors"
                >
                    <ChevronRight size={14} className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                    <span>{title}</span>
                </button>
            )}

            <AnimatePresence initial={false}>
                {(open || collapsed) && (
                    <motion.div
                        initial={collapsed ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-1 space-y-0.5 px-1"
                    >
                        {items.map(child => {
                            const isActive = currentUrl.startsWith(child.href);
                            return (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    {child.icon ? (
                                        <child.icon size={16} className={`flex-shrink-0 ${isActive ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`} />
                                    ) : (
                                        <FolderClosed size={16} className={`flex-shrink-0 ${isActive ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`} />
                                    )}
                                    {!collapsed && <span className="truncate">{child.label}</span>}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function LocationItem({ loc, collapsed, isAssetsPage, activeLocationId }) {
    const hasChildren = loc.children && loc.children.length > 0;
    const isParentActive = isAssetsPage && activeLocationId === String(loc.id);
    const isAnyChildActive = hasChildren && loc.children.some(c => isAssetsPage && activeLocationId === String(c.id));
    
    const storageKey = `location-item-open-${loc.id}`;
    const [open, setOpen] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) return stored === 'true';
        return isParentActive || isAnyChildActive;
    });

    const toggleOpen = (e) => {
        e.stopPropagation();
        if (hasChildren && !collapsed) {
            setOpen(prev => {
                const next = !prev;
                localStorage.setItem(storageKey, String(next));
                return next;
            });
        }
    };

    const handleParentClick = () => {
        router.get('/assets', { location_id: loc.id }, { preserveState: false });
    };

    return (
        <div>
            <div
                title={loc.nama}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isParentActive || isAnyChildActive
                        ? 'bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } ${collapsed ? 'justify-center' : ''}`}
            >
                <div 
                    onClick={handleParentClick}
                    className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                >
                    <Warehouse
                        size={18}
                        className={`flex-shrink-0 ${isParentActive || isAnyChildActive ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`}
                    />
                    {!collapsed && <span className="flex-1 text-left truncate">{loc.nama}</span>}
                </div>

                {hasChildren && !collapsed && (
                    <button
                        type="button"
                        onClick={toggleOpen}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 transition-colors"
                        title={open ? "Tutup Sub-lokasi" : "Buka Sub-lokasi"}
                    >
                        <ChevronRight
                            size={14}
                            className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                        />
                    </button>
                )}
            </div>

            {hasChildren && !collapsed && (
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 mt-0.5 space-y-0.5"
                        >
                            {loc.children.map(child => {
                                const isChildActive = isAssetsPage && activeLocationId === String(child.id);
                                return (
                                    <button
                                        key={child.id}
                                        title={child.nama}
                                        onClick={() => router.get('/assets', { location_id: child.id }, { preserveState: false })}
                                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                            ${isChildActive
                                                ? 'bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]'
                                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <MapPin
                                            size={14}
                                            className={`flex-shrink-0 ${isChildActive ? 'text-[hsl(var(--primary))]' : 'text-slate-400'}`}
                                        />
                                        <span className="truncate text-left">{child.nama}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

function LocationGroup({ locations, currentUrl, collapsed }) {
    const searchParams = new URLSearchParams(window.location.search);
    const activeLocationId = searchParams.get('location_id');
    const isAssetsPage = currentUrl.startsWith('/assets');

    if (!locations || locations.length === 0) return null;

    return (
        <div className="mt-6">
            {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Lokasi
                </p>
            )}
            <div className="space-y-0.5">
                {locations.map(loc => (
                    <LocationItem
                        key={loc.id}
                        loc={loc}
                        collapsed={collapsed}
                        isAssetsPage={isAssetsPage}
                        activeLocationId={activeLocationId}
                    />
                ))}
            </div>
        </div>
    );
}

// SidebarContent is defined OUTSIDE AuthenticatedLayout to avoid hook violations
function SidebarContent({ collapsed, settings, auth, sidebarLocations, currentUrl, onLogout }) {
    return (
        <div className="flex flex-col h-full bg-[#f9f9fb] border-r border-slate-200">
            {/* Logo & Institusi */}
            <div className={`flex flex-col items-center gap-3 px-4 py-6 text-center ${collapsed ? 'justify-center' : ''}`}>
                {settings?.institution_logo ? (
                    <img
                        src={settings.institution_logo}
                        alt={settings.institution_name}
                        className={`object-contain rounded flex-shrink-0 transition-all ${collapsed ? 'w-10 h-10' : 'w-16 h-16'}`}
                    />
                ) : (
                    <div className={`rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${collapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
                        <Building2 size={collapsed ? 20 : 32} className="text-white" />
                    </div>
                )}
                {!collapsed && (
                    <div className="overflow-hidden w-full flex flex-col items-center">
                        <p className="text-slate-800 font-bold text-base leading-tight w-full truncate">
                            {settings?.institution_name || 'My Workspace'}
                        </p>
                        <p className="text-slate-500 text-xs w-full truncate mt-1">
                            {settings?.app_description || 'Inventaris & Aset'}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar space-y-1">
                {navItems.map(item => (
                    <NavItem key={item.label} item={item} currentUrl={currentUrl} collapsed={collapsed} />
                ))}

                <FolderGroup
                    title="Master Data"
                    items={masterDataItems}
                    currentUrl={currentUrl}
                    collapsed={collapsed}
                    defaultOpen={true}
                />

                <LocationGroup
                    locations={sidebarLocations}
                    currentUrl={currentUrl}
                    collapsed={collapsed}
                />

                {auth.user?.is_admin && (
                    <FolderGroup
                        title="Administrasi"
                        items={adminNavItems}
                        currentUrl={currentUrl}
                        collapsed={collapsed}
                    />
                )}
            </nav>

            {/* User Info & Logout */}
            <div className="p-3 mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
                <div className={`group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <span className="text-slate-600 text-xs font-bold uppercase">
                            {auth.user?.name?.charAt(0)}
                        </span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-slate-800 text-sm font-semibold truncate leading-tight">{auth.user?.name}</p>
                            <p className="text-slate-500 text-xs capitalize leading-tight mt-0.5">{auth.user?.role}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onLogout(); }}
                            className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50"
                            title="Keluar"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

export default function AuthenticatedLayout({ header, children }) {
    const { auth, settings, sidebarLocations } = usePage().props;
    const currentUrl = window.location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (settings?.primary_color_hsl) {
            document.documentElement.style.setProperty('--primary', settings.primary_color_hsl);
        }
    }, [settings?.primary_color_hsl]);

    const handleLogout = () => router.post('/logout');

    const sidebarProps = { settings, auth, sidebarLocations, currentUrl, onLogout: handleLogout };

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
            {/* Sidebar Desktop */}
            <motion.aside
                onClick={() => { if (!sidebarOpen) setSidebarOpen(true); }}
                animate={{ width: sidebarOpen ? 256 : 72 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 ${!sidebarOpen ? 'cursor-pointer' : ''}`}
            >
                <div className="absolute top-20 -right-3 z-50">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--primary))] border border-transparent shadow-md text-white hover:opacity-90 transition-all"
                    >
                        <ChevronRight size={14} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className="w-full h-full overflow-hidden">
                    <SidebarContent collapsed={!sidebarOpen} {...sidebarProps} />
                </div>
            </motion.aside>

            {/* Mobile Bottom Sheet Menu (Lainnya) */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-4 pb-20 max-h-[85vh] overflow-y-auto lg:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"></div>
                                    <h3 className="font-bold text-slate-800 text-base">Menu Lainnya</h3>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="space-y-5">
                                {/* Navigasi Utama & Transaksi */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigasi Utama</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href="/loans"
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${currentUrl.startsWith('/loans') ? 'bg-[hsl(var(--primary)/0.08)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]' : 'bg-slate-50 border-slate-200/60 text-slate-700'}`}
                                        >
                                            <Warehouse size={18} className={currentUrl.startsWith('/loans') ? 'text-[hsl(var(--primary))]' : 'text-slate-500'} />
                                            <span>Peminjaman</span>
                                        </Link>
                                        <Link
                                            href="/reports"
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${currentUrl.startsWith('/reports') ? 'bg-[hsl(var(--primary)/0.08)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]' : 'bg-slate-50 border-slate-200/60 text-slate-700'}`}
                                        >
                                            <FileWarning size={18} className={currentUrl.startsWith('/reports') ? 'text-[hsl(var(--primary))]' : 'text-slate-500'} />
                                            <span>Laporan Kendala</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Master Data */}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Master Data</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {masterDataItems.map(item => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${currentUrl.startsWith(item.href) ? 'bg-[hsl(var(--primary)/0.08)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]' : 'bg-slate-50 border-slate-200/60 text-slate-700'}`}
                                            >
                                                <item.icon size={18} className={currentUrl.startsWith(item.href) ? 'text-[hsl(var(--primary))]' : 'text-slate-500'} />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Location Filter */}
                                {sidebarLocations && sidebarLocations.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filter Lokasi Aset</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sidebarLocations.map(loc => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => {
                                                        setMobileOpen(false);
                                                        router.get('/assets', { location_id: loc.id }, { preserveState: false });
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 border border-slate-200/60"
                                                >
                                                    <MapPin size={12} className="text-slate-400" />
                                                    {loc.nama}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Administrasi (Admin Only) */}
                                {auth.user?.is_admin && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Administrasi</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {adminNavItems.map(item => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${currentUrl.startsWith(item.href) ? 'bg-[hsl(var(--primary)/0.08)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]' : 'bg-slate-50 border-slate-200/60 text-slate-700'}`}
                                                >
                                                    <item.icon size={18} className={currentUrl.startsWith(item.href) ? 'text-[hsl(var(--primary))]' : 'text-slate-500'} />
                                                    <span>{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Profile & Logout */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-bold text-sm flex items-center justify-center border border-[hsl(var(--primary)/0.2)]">
                                            {auth.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 leading-tight">{auth.user?.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{auth.user?.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut size={14} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-14">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-slate-800">{header}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around lg:hidden">
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${currentUrl === '/dashboard' ? 'text-[hsl(var(--primary))] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-[10px]">Dashboard</span>
                    </Link>

                    <Link
                        href="/assets"
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${currentUrl.startsWith('/assets') ? 'text-[hsl(var(--primary))] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Cpu size={20} />
                        <span className="text-[10px]">Aset</span>
                    </Link>

                    {/* Prominent Center Scan Button */}
                    <Link
                        href="/scanner"
                        className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-[hsl(var(--primary))] text-white shadow-md hover:opacity-95 transition-transform active:scale-95"
                        title="Scan QR"
                    >
                        <ScanLine size={22} />
                    </Link>

                    <Link
                        href="/consumables"
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${currentUrl.startsWith('/consumables') ? 'text-[hsl(var(--primary))] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Package size={20} />
                        <span className="text-[10px]">Consumable</span>
                    </Link>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${mobileOpen ? 'text-[hsl(var(--primary))] font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <MoreHorizontal size={20} />
                        <span className="text-[10px]">Lainnya</span>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
            `}} />
        </div>
    );
}
