import { useState, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function DataTable({ data, columns, pagination = true, groupBy, groupHeader, groupByAction, subItemsKey }) {
    // data.data refers to the actual array of rows if it's a paginated object
    const rows = pagination && data?.data ? data.data : (data || []);
    const links = pagination && data?.links ? data.links : [];

    const [collapsedGroups, setCollapsedGroups] = useState(new Set());

    const toggleGroup = (key) => {
        const newSet = new Set(collapsedGroups);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        setCollapsedGroups(newSet);
    };

    // Parse groupBy into an array of groupers
    const groupers = groupBy
        ? (Array.isArray(groupBy) ? groupBy : [groupBy])
        : [];

    // Helper to group items recursively
    const buildGroupTree = (items, depth = 0) => {
        if (depth >= groupers.length) {
            return items; // leaf nodes
        }
        const grouper = groupers[depth];
        const groups = {};
        items.forEach(row => {
            const key = grouper(row);
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
        });
        return Object.entries(groups).map(([key, subItems]) => {
            const groupKey = `${depth}-${key}`;
            return {
                isGroupHeader: true,
                depth,
                key,
                groupKey,
                items: subItems,
                children: buildGroupTree(subItems, depth + 1)
            };
        });
    };

    const getVisibleRows = (nodes) => {
        const result = [];
        const traverse = (list) => {
            list.forEach(node => {
                if (node.isGroupHeader) {
                    result.push(node);
                    if (!collapsedGroups.has(node.groupKey)) {
                        traverse(node.children);
                    }
                } else {
                    result.push(node);
                }
            });
        };
        traverse(nodes);
        return result;
    };

    let displayRows = [];
    if (groupers.length > 0 && rows.length > 0) {
        const tree = buildGroupTree(rows);
        displayRows = getVisibleRows(tree);
    } else {
        displayRows = rows;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col w-full overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar relative w-full">
                <table className="w-full text-left border-collapse relative min-w-max">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-slate-200">
                            {columns.map((col, i) => (
                                <th key={i} className={`bg-slate-50/95 backdrop-blur-sm px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider ${col.headerClassName || col.cellClassName || col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayRows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500 text-sm">
                                    Tidak ada data yang ditemukan.
                                </td>
                            </tr>
                        ) : (
                            displayRows.map((rowOrGroup, i) => {
                                if (rowOrGroup.isGroupHeader) {
                                    const isCollapsed = collapsedGroups.has(rowOrGroup.groupKey);
                                    
                                    return (
                                        <tr 
                                            key={rowOrGroup.groupKey}
                                            className={`cursor-pointer border-y border-slate-200 transition-colors shadow-2xs
                                                ${rowOrGroup.depth === 0 
                                                    ? 'bg-slate-100 hover:bg-slate-200/80 font-semibold' 
                                                    : 'bg-slate-50 hover:bg-slate-100 font-medium'
                                                }`}
                                            onClick={() => toggleGroup(rowOrGroup.groupKey)}
                                        >
                                            {columns.map((col, k) => {
                                                if (k === 0) {
                                                    return (
                                                        <td key={k} className="px-4 py-3 text-slate-900 text-sm">
                                                            <div 
                                                                className="flex items-center gap-2"
                                                                style={{ paddingLeft: `${rowOrGroup.depth * 1.5}rem` }}
                                                            >
                                                                {isCollapsed 
                                                                    ? <ChevronRight size={16} className="text-slate-500 shrink-0" />
                                                                    : <ChevronDown size={16} className="text-slate-500 shrink-0" /> 
                                                                }
                                                                <div>
                                                                    {groupHeader 
                                                                        ? groupHeader(rowOrGroup.key, rowOrGroup.items, rowOrGroup.depth) 
                                                                        : `${rowOrGroup.key} (${rowOrGroup.items.length})`
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                if (k === columns.length - 1 && groupByAction) {
                                                    return (
                                                        <td key={k} className={`px-4 py-3 ${col.cellClassName || ''}`}>
                                                            {groupByAction(rowOrGroup.key, rowOrGroup.items, rowOrGroup.depth)}
                                                        </td>
                                                    );
                                                }
                                                return <td key={k} className="px-4 py-3"></td>;
                                            })}
                                        </tr>
                                    );
                                }

                                // Mode Normal / Leaf Row
                                const row = rowOrGroup;
                                return (
                                    <tr key={row.id || i} className="hover:bg-slate-50/50 transition-colors bg-white">
                                        {columns.map((col, k) => (
                                            <td 
                                                key={k} 
                                                className={`py-3 text-sm text-slate-700 ${col.cellClassName || ''}`}
                                                style={k === 0 && groupers.length > 0
                                                    ? { paddingLeft: `${groupers.length * 1.5 + 0.75}rem` }
                                                    : { paddingLeft: '1rem', paddingRight: '1rem' }
                                                }
                                            >
                                                {col.cell ? col.cell(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && links.length > 3 && (
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Menampilkan <span className="font-medium">{data.from || 0}</span> sampai{' '}
                                <span className="font-medium">{data.to || 0}</span> dari{' '}
                                <span className="font-medium">{data.total}</span> hasil
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                {links.map((link, i) => {
                                    let label = link.label;
                                    if (label.includes('Previous')) label = <ChevronLeft size={16} />;
                                    if (label.includes('Next')) label = <ChevronRight size={16} />;

                                    if (!link.url) {
                                        return (
                                            <span key={i} className="relative inline-flex items-center px-3 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-400 cursor-not-allowed rounded-md mx-0.5">
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md mx-0.5 transition-colors
                                                ${link.active
                                                    ? 'z-10 bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white'
                                                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: typeof label === 'string' ? label : '' }}
                                        >
                                            {typeof label !== 'string' ? label : null}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
