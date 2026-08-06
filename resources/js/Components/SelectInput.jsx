import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export default function SelectInput({ value, onChange, options, placeholder = 'Pilih salah satu', className = '', error = false, disabled = false }) {
    // Cari opsi yang terpilih berdasarkan value
    const selected = options.find(opt => String(opt.value) === String(value)) || null;

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled}>
            <div className={`relative ${className}`}>
                <Listbox.Button 
                    className={`relative w-full cursor-pointer rounded-lg border bg-white py-2.5 pl-3 pr-10 text-left text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))]
                    ${error ? 'border-red-500' : 'border-slate-300'}
                    ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'hover:border-slate-400'}
                    `}
                >
                    <span className={`block truncate ${!selected ? 'text-slate-400' : 'text-slate-900'}`}>
                        {selected ? (selected.displayLabel || selected.label) : placeholder}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className={`h-4 w-4 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} aria-hidden="true" />
                    </span>
                </Listbox.Button>
                
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1.5 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none custom-scrollbar">
                        {options.length === 0 ? (
                            <div className="py-2.5 px-4 text-slate-500 text-sm text-center">Tidak ada opsi</div>
                        ) : (
                            options.map((option, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2.5 pr-4 transition-colors ${
                                            active ? 'bg-slate-50 text-[hsl(var(--primary))]' : 'text-slate-700'
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => {
                                        const isChild = option.depth > 0;
                                        const paddingLeft = isChild ? `${(option.depth * 0.8) + 2}rem` : '2rem';
                                        return (
                                            <div 
                                                className="flex items-center gap-2"
                                                style={{ paddingLeft }}
                                            >
                                                {isChild && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                                )}
                                                <span className={`block truncate ${
                                                    !isChild ? 'font-semibold text-slate-800' : 'text-sm text-slate-600'
                                                } ${selected ? '!text-[hsl(var(--primary))] font-bold' : ''}`}>
                                                    {option.displayLabel || option.label}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-[hsl(var(--primary))]">
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
        </Listbox>
    );
}
