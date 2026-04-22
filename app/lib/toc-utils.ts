/**
 * TOC Utility
 * Phân tích HTML content, inject ID vào h2/h3 và trả về danh sách heading.
 */

export interface TocHeading {
    id: string;
    text: string;
    level: 2 | 3;
}

/**
 * Chuyển text thành slug để dùng làm HTML id
 * Ví dụ: "Phân biệt Senior Engineer" → "phan-biet-senior-engineer"
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

/**
 * Xử lý HTML content:
 * 1. Tìm các thẻ h2, h3
 * 2. Inject id vào những thẻ chưa có id
 * 3. Trả về: HTML đã chỉnh sửa + danh sách heading để render TOC
 */
export function extractToc(html: string): {
    modifiedHtml: string;
    headings: TocHeading[];
} {
    if (!html) return { modifiedHtml: html, headings: [] };

    const headings: TocHeading[] = [];
    const slugCount: Record<string, number> = {};

    const modifiedHtml = html.replace(
        /<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi,
        (match, tag, attrs, innerContent) => {
            const level = parseInt(tag[1]) as 2 | 3;

            // Lấy text thuần từ inner HTML (loại bỏ các thẻ HTML con)
            const text = innerContent.replace(/<[^>]+>/g, "").trim();

            // Kiểm tra xem đã có id chưa
            const existingIdMatch = attrs.match(/id=["']([^"']+)["']/i);
            let id: string;

            if (existingIdMatch) {
                id = existingIdMatch[1];
            } else {
                let slug = slugify(text) || `heading-${headings.length + 1}`;

                // Đảm bảo id là duy nhất
                if (slugCount[slug] !== undefined) {
                    slugCount[slug]++;
                    slug = `${slug}-${slugCount[slug]}`;
                } else {
                    slugCount[slug] = 0;
                }
                id = slug;
            }

            headings.push({ id, text, level });

            // Inject id vào thẻ heading nếu chưa có
            if (existingIdMatch) {
                return match;
            }
            return `<${tag}${attrs} id="${id}">${innerContent}</${tag}>`;
        }
    );

    return { modifiedHtml, headings };
}
