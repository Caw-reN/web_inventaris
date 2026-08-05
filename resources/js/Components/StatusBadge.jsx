import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-slate-100 text-slate-800',
                success: 'bg-green-100 text-green-800 border border-green-200',
                warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                danger: 'bg-red-100 text-red-800 border border-red-200',
                info: 'bg-blue-100 text-blue-800 border border-blue-200',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export default function StatusBadge({ status, label, className }) {
    let variant = 'default';

    // Mapping untuk status Aset
    if (status === 'tersedia') variant = 'success';
    if (status === 'digunakan') variant = 'info';
    if (status === 'maintenance') variant = 'warning';
    if (status === 'rusak') variant = 'danger';
    if (status === 'tidak_aktif') variant = 'default';

    // Mapping untuk status Laporan
    if (status === 'open') variant = 'danger';
    if (status === 'in_progress') variant = 'warning';
    if (status === 'resolved') variant = 'success';

    return (
        <span className={cn(badgeVariants({ variant }), className)}>
            {label || status}
        </span>
    );
}
