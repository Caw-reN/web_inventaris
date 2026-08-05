import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function ThemeProvider({ children }) {
    const { settings } = usePage().props;

    useEffect(() => {
        if (settings?.primary_color_hsl) {
            document.documentElement.style.setProperty('--primary', settings.primary_color_hsl);
        }
    }, [settings?.primary_color_hsl]);

    return <>{children}</>;
}
