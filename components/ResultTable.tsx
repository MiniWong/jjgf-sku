import React from 'react';
import { GeneratedSku } from '../types';
import { Download, FileText, Layers } from 'lucide-react';

interface ResultTableProps {
    results: GeneratedSku[];
}

export const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
    
    const handleExportCSV = () => {
        const headers = ['商品编码 (Product Code)', '货品简称 (Abbreviation)', 'Frame', 'Size', 'Color', 'Orientation', 'Image'];
        const rows = results.map(r => [
            r.sku,
            r.name,
            r.components.frame.code,
            r.components.size.code,
            r.components.color.code,
            r.components.orientation.code,
            r.components.image.code
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `sku_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full bg-[#0f0f11] rounded-3xl border border-[#27272a] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#27272a]">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1f1f23] p-2.5 rounded-xl text-sky-500 border border-[#27272a]">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-100">生成结果预览</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-500">共生成 {results.length} 条数据组合</span>
                            {results.length > 0 && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleExportCSV}
                    disabled={results.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#09090b] bg-white hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Download size={16} />
                    导出 CSV
                </button>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto relative custom-scrollbar bg-[#0f0f11]">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#0f0f11] z-10 shadow-sm">
                        <tr>
                            <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a]">商品编码 (PRODUCT CODE)</th>
                            <th className="py-5 px-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#27272a]">货品简称 (ABBREVIATION)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                        {results.map((result) => (
                            <tr key={result.id} className="hover:bg-[#1f1f23] group transition-colors">
                                <td className="py-4 px-8">
                                    <div className="font-bold text-gray-300 text-sm tracking-wide font-mono group-hover:text-white transition-colors">
                                        {result.sku}
                                    </div>
                                </td>
                                <td className="py-4 px-8">
                                    <div className="text-sm text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                                        {result.name}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {results.length === 0 && (
                            <tr>
                                <td colSpan={2} className="py-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                                        <Layers size={48} className="text-gray-600" />
                                        <p className="text-gray-500 text-sm">暂无数据，请选择上方字段</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};