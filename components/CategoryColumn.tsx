import React, { useState } from 'react';
import { Category } from '../types';
import { Plus, Trash2, CheckCircle2, X } from 'lucide-react';

interface CategoryColumnProps {
    category: Category;
    onToggleOption: (categoryId: string, optionId: string) => void;
    onAddOption: (categoryId: string, code: string, abbr: string) => void;
    onDeleteOption: (categoryId: string, optionId: string) => void;
    index: number;
}

export const CategoryColumn: React.FC<CategoryColumnProps> = ({ 
    category, 
    onToggleOption, 
    onAddOption, 
    onDeleteOption,
    index
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [newAbbr, setNewAbbr] = useState('');

    const handleAdd = () => {
        if (!newCode.trim()) return;
        onAddOption(category.id, newCode.trim(), newAbbr.trim());
        setNewCode('');
        setNewAbbr('');
        setIsAdding(false);
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
            <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 custom-scrollbar">
                {category.options.map(option => (
                    <div 
                        key={option.id}
                        onClick={() => onToggleOption(category.id, option.id)}
                        className={`
                            group relative flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all duration-200 select-none
                            ${option.selected 
                                ? 'bg-[#111927] border-sky-900/50 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]' 
                                : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'}
                        `}
                    >
                        <div className="flex flex-col gap-1">
                            <span className={`font-bold text-sm ${option.selected ? 'text-white' : 'text-gray-200'}`}>
                                {option.code}
                            </span>
                            <span className={`text-xs ${option.selected ? 'text-gray-400' : 'text-gray-500'}`}>
                                {isImageCategory ? (option.abbr || option.code) : (option.abbr || 'N/A')}
                            </span>
                        </div>

                        <div className="flex items-center">
                             {option.selected ? (
                                <CheckCircle2 size={18} className="text-sky-500" />
                            ) : (
                                <div className="w-[18px] h-[18px] rounded-full border border-[#3f3f46] group-hover:border-gray-500"></div>
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
                    </div>
                ))}

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
                                    className="w-full bg-[#09090b] text-white px-3 py-2 text-xs border border-[#3f3f46] rounded-lg focus:outline-none focus:border-sky-500 placeholder-gray-600 font-mono"
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
                                        className="w-full bg-[#09090b] text-white px-3 py-2 text-xs border border-[#3f3f46] rounded-lg focus:outline-none focus:border-sky-500 placeholder-gray-600"
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