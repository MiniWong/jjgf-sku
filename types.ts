export interface Option {
    id: string;
    code: string;
    abbr: string; // Abbreviation
    selected: boolean;
}

export interface Category {
    id: string;
    key: CategoryKey;
    name: string;
    options: Option[];
}

export type CategoryKey = 'frame' | 'size' | 'color' | 'orientation' | 'image';

export interface GeneratedSku {
    id: string;
    sku: string;
    name: string;
    components: Record<CategoryKey, Option>;
}

export interface AppState {
    categories: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'c1', key: 'frame', name: '框条编码', options: [] },
    { id: 'c2', key: 'size', name: '尺寸编码', options: [] },
    { id: 'c3', key: 'color', name: '颜色编码', options: [] },
    { id: 'c4', key: 'orientation', name: '横竖编码', options: [] },
    { id: 'c5', key: 'image', name: '画面编码', options: [] },
];