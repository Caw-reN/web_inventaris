import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export default function SelectInput({ value, onChange, options = [], placeholder = 'Pilih salah satu', className = '', error = false, disabled = false }) {
    // Cari opsi yang terpilih berdasarkan value
    const selected = options.find(opt => String(opt.value) === String(value)) || null;

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled}>
            {({ open }) => (
                <div className={`relative ${className}`}>
                    <Listbox.Button 
                        className={`relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-9 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] shadow-2xs
                        ${error ? 'border-red-500' : 'border-slate-300'}
                        ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'hover:border-slate-400'}
                        `}
                    >
                        <span className={`block truncate ${!selected || selected.value === '' ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>
                            {selected ? (selected.displayLabel || selected.label) : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180 text-[hsl(var(--primary))]' : 'text-slate-400'}`} aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full min-w-[140px] overflow-auto rounded-xl bg-white py-1.5 text-sm shadow-xl border border-slate-200/90 focus:outline-none custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="py-2.5 px-4 text-slate-500 text-sm text-center">Tidak ada opsi</div>
                            ) : (
                                options.map((option, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active, selected: isSelected }) =>
                                            `relative cursor-pointer select-none py-2 pl-3 pr-8 transition-colors ${
                                                active ? 'bg-slate-100/80 text-slate-900' : ''
                                            } ${isSelected ? 'bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))] font-semibold' : 'text-slate-700'}`
                                        }
                                        value={option.value}
                                    >
                                        {({ selected: isSelected }) => {
                                            const isChild = option.depth > 0;
                                            const indent = option.depth > 0 ? (option.depth * 0.75) : 0;
                                            return (
                                                <div 
                                                    className="flex items-center justify-between"
                                                    style={{ paddingLeft: `${indent}rem` }}
                                                >
                                                    <div className="flex items-center gap-1.5 truncate">
                                                        {isChild && (
                                                            <span className="text-slate-400 font-mono text-xs select-none">└</span>
                                                        )}
                                                        <span className={`block truncate ${
                                                            !isChild ? 'font-medium' : 'text-xs text-slate-600'
                                                        }`}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[hsl(var(--primary))]">
                                                            <Check className="h-4 w-4" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </Listbox.Option>
                                ))
                            )}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
