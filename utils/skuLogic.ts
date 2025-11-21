import { Category, GeneratedSku, Option } from '../types';

export const generateSkus = (categories: Category[]): GeneratedSku[] => {
    // Extract selected options for each category
    const frames = categories.find(c => c.key === 'frame')?.options.filter(o => o.selected) || [];
    const sizes = categories.find(c => c.key === 'size')?.options.filter(o => o.selected) || [];
    const colors = categories.find(c => c.key === 'color')?.options.filter(o => o.selected) || [];
    const orientations = categories.find(c => c.key === 'orientation')?.options.filter(o => o.selected) || [];
    const images = categories.find(c => c.key === 'image')?.options.filter(o => o.selected) || [];

    const results: GeneratedSku[] = [];

    // Helper to join strings with a separator
    const join = (parts: string[]) => parts.filter(p => p).join('-');

    // Cartesian Product Loop
    for (const frame of frames) {
        for (const size of sizes) {
            for (const color of colors) {
                for (const orient of orientations) {
                    for (const image of images) {
                        
                        // --- Filtering Logic ---
                        const orientCode = orient.code.toUpperCase(); // Normalize orientation code
                        const imageCode = image.code.toLowerCase(); // Normalize image code for checking start
                        
                        // Rule: When Orientation is H, ignore Image codes starting with 's' (case insensitive)
                        if (orientCode === 'H' && imageCode.startsWith('s')) {
                            continue;
                        }

                        // Rule: When Orientation is S, ignore Image codes starting with 'h' (case insensitive)
                        if (orientCode === 'S' && imageCode.startsWith('h')) {
                            continue;
                        }

                        // --- Generation ---
                        
                        // SKU: All fields codes joined by '-'
                        const sku = join([frame.code, size.code, color.code, orient.code, image.code]);

                        // Name: All fields abbreviations EXCEPT Image joined by '-'
                        const name = join([frame.abbr, size.abbr, color.abbr, orient.abbr]);

                        results.push({
                            id: crypto.randomUUID(),
                            sku,
                            name,
                            components: {
                                frame,
                                size,
                                color,
                                orientation: orient,
                                image
                            }
                        });
                    }
                }
            }
        }
    }

    return results;
};