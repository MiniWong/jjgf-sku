
import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_CATEGORIES, Category } from './types';
import { generateSkus } from './utils/skuLogic';
import { CategoryColumn } from './components/CategoryColumn';
import { ResultTable } from './components/ResultTable';
import { Settings, Sparkles, Trash2, Save, Upload, AlertCircle, X, Layers, GitMerge } from 'lucide-react';
import { generateSampleData } from './services/geminiService';

const STORAGE_KEY = 'sku-generator-data-v4';

export default function App() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [apiKey] = useState(process.env.API_KEY || '');
  const [toast, setToast] = useState<{msg: string, type: 'error'|'success'} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].key) {
               setCategories(parsed);
            }
        } catch (e) {
            console.error("Failed to load saved data", e);
        }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // --- Actions ---

  const handleAddOption = (categoryId: string, code: string, abbr: string) => {
    setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
            return {
                ...cat,
                options: [...cat.options, {
                    id: crypto.randomUUID(),
                    code,
                    abbr,
                    selected: true
                }]
            };
        }
        return cat;
    }));
  };

  const handleUpdateOption = (categoryId: string, optionId: string, newCode: string, newAbbr: string) => {
    setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
            return {
                ...cat,
                options: cat.options.map(opt => 
                    opt.id === optionId ? { ...opt, code: newCode, abbr: newAbbr } : opt
                )
            };
        }
        return cat;
    }));
  };

  const handleToggleOption = (categoryId: string, optionId: string) => {
    setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
            return {
                ...cat,
                options: cat.options.map(opt => 
                    opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
                )
            };
        }
        return cat;
    }));
  };

  const handleDeleteOption = (categoryId: string, optionId: string) => {
     setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
            return {
                ...cat,
                options: cat.options.filter(opt => opt.id !== optionId)
            };
        }
        return cat;
    }));
  };

  const handleReset = () => {
    if(confirm('Are you sure you want to clear all data?')) {
        setCategories(DEFAULT_CATEGORIES);
    }
  };

  const handleSmartFill = async () => {
      if (!apiKey) {
          setToast({ msg: "API Key required in environment variables.", type: 'error' });
          return;
      }
      
      setIsLoadingAi(true);
      try {
          const generatedData = await generateSampleData(apiKey);
          
          setCategories(prev => prev.map(cat => {
              const match = generatedData.find(g => g.key === cat.key);
              if (match && match.options) {
                  // Keep existing options, add new ones unique by code
                  const existingCodes = new Set(cat.options.map(o => o.code.toLowerCase()));
                  const newOptions = match.options
                    .filter((o: any) => !existingCodes.has(o.code.toLowerCase()))
                    .map((o: any) => ({
                      id: crypto.randomUUID(),
                      code: o.code,
                      abbr: o.abbr || '',
                      selected: true
                  }));
                  return { ...cat, options: [...cat.options, ...newOptions] };
              }
              return cat;
          }));
          setToast({ msg: "Data populated successfully!", type: 'success' });
      } catch (e) {
          console.error(e);
          setToast({ msg: "Failed to generate data.", type: 'error' });
      } finally {
          setIsLoadingAi(false);
      }
  };

  const exportConfig = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "sku_config.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setIsSettingsOpen(false);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const json = JSON.parse(e.target?.result as string);
              if (Array.isArray(json) && json.length === 5) {
                  setCategories(json);
                  setToast({ msg: "Configuration imported!", type: 'success' });
              } else {
                  throw new Error("Invalid format");
              }
          } catch (err) {
              setToast({ msg: "Invalid JSON file", type: 'error' });
          }
          setIsSettingsOpen(false);
      };
      reader.readAsText(file);
  };

  const results = useMemo(() => generateSkus(categories), [categories]);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-sky-500/30">
      
      {/* --- Top Bar --- */}
      <header className="flex items-center justify-between px-8 py-6 bg-[#09090b] shrink-0 z-20 sticky top-0 border-b border-[#27272a]/50 backdrop-blur-xl bg-opacity-80">
        <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-sky-600 text-white p-2.5 rounded-xl shadow-lg shadow-sky-900/20">
                <Layers size={24} />
            </div>
            <div>
                <h1 className="text-xl font-black text-white tracking-tight">商品编码生成器</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Product Code Generator</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
             {/* Toast */}
             {toast && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium animate-in slide-in-from-top-5 fade-in ${toast.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                    {toast.type === 'error' ? <AlertCircle size={16} /> : <Save size={16} />}
                    {toast.msg}
                    <button onClick={() => setToast(null)} className="ml-2 hover:text-white"><X size={16}/></button>
                </div>
            )}

            <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-all"
            >
                <Settings size={20} />
                <span className="text-sm font-bold">预设管理</span>
            </button>
        </div>
      </header>

      {/* --- Settings Dropdown --- */}
      {isSettingsOpen && (
          <div className="fixed top-24 right-8 z-50 w-72 bg-[#18181b] rounded-xl shadow-2xl border border-[#27272a] p-1 animate-in fade-in zoom-in-95">
              <div className="p-2 pb-0">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Data Controls</h3>
              </div>
              <div className="space-y-1">
                  <button onClick={handleSmartFill} disabled={isLoadingAi} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-sky-400 hover:bg-[#27272a] rounded-lg transition-colors text-left">
                        <Sparkles size={16} className={isLoadingAi ? 'animate-spin' : ''} />
                        {isLoadingAi ? 'Generating...' : 'AI Smart Populate'}
                  </button>
                  <button onClick={exportConfig} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-[#27272a] rounded-lg transition-colors text-left">
                      <Save size={16} /> Export Config (JSON)
                  </button>
                  <div className="relative group">
                      <input type="file" accept=".json" onChange={importConfig} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 group-hover:bg-[#27272a] rounded-lg transition-colors text-left">
                          <Upload size={16} /> Import Config (JSON)
                      </button>
                  </div>
                   <div className="h-px bg-[#27272a] my-1 mx-2"></div>
                  <button onClick={handleReset} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-left">
                      <Trash2 size={16} /> Clear All Data
                  </button>
              </div>
          </div>
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 relative px-8 pb-10 pt-2 flex flex-col gap-8 max-w-[1920px] mx-auto w-full">
         {/* Background Gradient */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-sky-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
         </div>
            
         {/* Section Header */}
         <div className="flex-shrink-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-white">
                 <div className="bg-purple-500/10 p-1.5 rounded-lg text-purple-400">
                     <GitMerge size={18} />
                 </div>
                 <h2 className="text-lg font-bold">字段配置</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-full text-xs text-gray-500 font-medium">
                 <GitMerge size={14} className="text-orange-500" />
                 <span>从左至右组合生成</span>
            </div>
         </div>
            
         {/* Top: Field Configuration */}
         {/* Layout: Auto height, Grid expands based on content */}
         <div className="w-full z-10">
            <div className="grid grid-cols-5 gap-4 w-full">
                {categories.map((category, idx) => (
                    <div className="min-w-0" key={category.id}>
                        <CategoryColumn 
                            category={category}
                            index={idx}
                            onToggleOption={handleToggleOption}
                            onAddOption={handleAddOption}
                            onUpdateOption={handleUpdateOption}
                            onDeleteOption={handleDeleteOption}
                        />
                    </div>
                ))}
            </div>
         </div>

         {/* Bottom: Results */}
         {/* Layout: Fixed height for the table viewer, creating a stable window below the growing config section */}
         <div className="w-full h-[600px] z-10">
            <ResultTable results={results} />
         </div>
      </main>
    </div>
  );
}