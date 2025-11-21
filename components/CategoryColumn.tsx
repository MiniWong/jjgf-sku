
import React, { useState } from 'react';
import { Category, Option } from '../types';
import { Plus, Trash2, CheckCircle2, Check, X } from 'lucide-react';

interface CategoryColumnProps {
    category: Category;
    onToggleOption: (categoryId: string, optionId: string) => void;
    onAddOption: (categoryId: string, code: string, abbr: string) => void;
    onUpdateOption: (categoryId: string, optionId: string, code: string, abbr: string) => void;
    onDeleteOption: (categoryId: string, optionId: string) => void;
    index: number;
}

export const CategoryColumn: React.FC<CategoryColumnProps> = ({ 
    category, 
    onToggleOption, 
    onAddOption, 
    onUpdateOption,
    onDeleteOption,
    index
}) => {
    // Add State
    const [isAdding, setIsAdding] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [newAbbr, setNewAbbr] = useState('');

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCode, setEditCode] = useState('');
    const [editAbbr, setEditAbbr] = useState('');

    const handleAdd = () => {
        if (!newCode.trim()) return;
        onAddOption(category.id, newCode.trim(), newAbbr.trim());
        setNewCode('');
        setNewAbbr('');
        setIsAdding(false);
    };

    const startEditing = (option: Option) => {
        setEditingId(option.id);
        setEditCode(option.code);
        setEditAbbr(option.abbr);
    };

    const saveEditing = () => {
        if (editingId && editCode.trim()) {
            onUpdateOption(category.id, editingId, editCode.trim(), editAbbr.trim());
            setEditingId(null);
        }
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const isImageCategory = category.key === 'image';

    return (
        <div className="flex flex-col w-full h-full bg-[#0f0f11] rounded-2xl border border-[#27272a] overflow-hidden transition-all hover:border-[#3f3f46]">
            {/* Header */}
            <div className="p-5 flex items-start justify-between bg-[#0f0f11]">
                <div>
                    <h3 className="font-bold text-lg text-gray-100 tracking-tight">{category.name}</h3>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">SELECT OPTION</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1f1f23] text-xs font-bold text-gray-400 flex items-center justify-center border border-[#27272a]">
                    {index + 1}
                </div>
            </div>

            {/* List */}
            {/* Added min-h-[450px] and max-h-[800px] to ensure columns grow with content but eventually scroll */}
            <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 custom-scrollbar min-h-[450px] max-h-[800px]">
                {category.options.map(option => {
                    const isEditing = editingId === option.id;

                    return (
                        <div 
                            key={option.id}
                            onClick={() => !isEditing && onToggleOption(category.id, option.id)}
                            onDoubleClick={() => !isEditing && startEditing(option)}
                            className={`
                                group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 select-none
                                ${isEditing 
                                    ? 'bg-[#18181b] border-sky-500/50 ring-1 ring-sky-500/20 cursor-default' 
                                    : option.selected 
                                        ? 'bg-[#111927] border-sky-900/50 shadow-[0_0_0_1px_rgba(14,165,233,0.2)] cursor-pointer' 
                                        : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46] cursor-pointer'
                                }
                            `}
                        >
                            {isEditing ? (
                                /* Edit Mode */
                                <div className="flex flex-col gap-2 w-full" onClick={e => e.stopPropagation()}>
                                     <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            autoFocus
                                            value={editCode}
                                            onChange={(e) => setEditCode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') saveEditing();
                                                if(e.key === 'Escape') cancelEditing();
                                            }}
                                            className="w-full bg-[#09090b] text-white px-2 py-1 text-sm border border-[#3f3f46] rounded focus:outline-none focus:border-sky-500 font-mono"
                                            placeholder="Code"
                                        />
                                        {!isImageCategory && (
                                            <input 
                                                type="text" 
                                                value={editAbbr}
                                                onChange={(e) => setEditAbbr(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter') saveEditing();
                                                    if(e.key === 'Escape') cancelEditing();
                                                }}
                                                className="w-full bg-[#09090b] text-white px-2 py-1 text-sm border border-[#3f3f46] rounded focus:outline-none focus:border-sky-500"
                                                placeholder="Abbr"
                                            />
                                        )}
                                     </div>
                                     <div className="flex items-center justify-end gap-2">
                                         <button onClick={cancelEditing} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><X size={14} /></button>
                                         <button onClick={saveEditing} className="p-1 bg-sky-600/20 hover:bg-sky-600 text-sky-500 hover:text-white rounded transition-colors"><Check size={14} /></button>
                                     </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <>
                                    <div className="flex flex-col gap-1">
                                        <span className={`font-bold text-lg tracking-wide ${option.selected ? 'text-white' : 'text-gray-200'}`}>
                                            {option.code}
                                        </span>
                                        <span className={`text-sm font-medium ${option.selected ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {isImageCategory ? (option.abbr || option.code) : (option.abbr || 'N/A')}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        {option.selected ? (
                                            <CheckCircle2 size={20} className="text-sky-500" />
                                        ) : (
                                            <div className="w-[20px] h-[20px] rounded-full border border-[#3f3f46] group-hover:border-gray-500"></div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteOption(category.id, option.id);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-md text-gray-600 hover:text-red-400 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Inline Add Form / Add Button Slot */}
                {isAdding ? (
                    <div className="p-3 bg-[#18181b] border border-sky-500/30 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-3">
                             <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold px-1 block mb-1">Code</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="Code (e.g. K1)"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter') handleAdd();
                                        if(e.key === 'Escape') setIsAdding(false);
                                    }}
                                    className="w-full bg-[#09090b] text-white px-3 py-2 text-sm border border-[#3f3f46] rounded-lg focus:outline-none focus:border-sky-500 placeholder-gray-600 font-mono"
                                />
                             </div>
                            {!isImageCategory && (
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold px-1 block mb-1">Abbreviation</label>
                                    <input 
                                        type="text" 
                                        placeholder="Abbr (e.g. Black)"
                                        value={newAbbr}
                                        onChange={(e) => setNewAbbr(e.target.value)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter') handleAdd();
                                            if(e.key === 'Escape') setIsAdding(false);
                                        }}
                                        className="w-full bg-[#09090b] text-white px-3 py-2 text-sm border border-[#3f3f46] rounded-lg focus:outline-none focus:border-sky-500 placeholder-gray-600"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2 pt-1">
                                <button 
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAdd}
                                    disabled={!newCode}
                                    className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-[#27272a] rounded-xl text-gray-500 text-sm hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group"
                    >
                        <Plus size={16} className="group-hover:scale-110 transition-transform" />
                        添加新项
                    </button>
                )}
            </div>
        </div>
    );
};