import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            {status && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    {status}
                </div>
            )}

            {(errors.email || errors.password) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-600 text-sm">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                        {errors.email || errors.password}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">Selamat Datang</h2>
                    <p className="text-slate-500 text-sm">Masuk untuk mengelola inventaris</p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            autoComplete="username"
                            placeholder="admin@inventaris.app"
                            className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-lg text-slate-800 placeholder-slate-400 text-sm
                                focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all
                                ${errors.email ? 'border-red-500 ring-red-500/20' : 'border-slate-300'}`}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-lg text-slate-800 placeholder-slate-400 text-sm
                                focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all
                                ${errors.password ? 'border-red-500 ring-red-500/20' : 'border-slate-300'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] focus:ring-2 transition-all"
                        />
                        <span className="text-sm text-slate-500">Ingat saya</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-[hsl(var(--primary))] hover:underline"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm
                        bg-[hsl(var(--primary))] hover:opacity-90 text-white
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                        shadow-md shadow-[hsl(var(--primary)/0.2)]"
                >
                    <LogIn size={16} />
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>
            </form>
        </GuestLayout>
    );
}
