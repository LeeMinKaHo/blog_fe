/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║               API CLIENT — CENTRAL CONFIG             ║
 * ║  Tất cả cấu hình HTTP được định nghĩa ở đây.          ║
 * ║  Để thêm endpoint mới → tạo file trong app/services/  ║
 * ╚═══════════════════════════════════════════════════════╝
 */

// Đặt NEXT_PUBLIC_API_URL trong .env.local để browser gọi
// Đặt API_URL (không có NEXT_PUBLIC_) để Next server gọi nội bộ (Docker)
const isServer = typeof window === "undefined";

export const API_BASE_URL = isServer
    ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000");

// ─── Error class ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
    statusCode: number;
    errorCode?: string;
    details?: unknown;

    constructor(
        message: string,
        statusCode: number,
        errorCode?: string,
        details?: unknown
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}

// ─── Default options ───────────────────────────────────────────────────────────
const DEFAULT_HEADERS: HeadersInit = {
    "Content-Type": "application/json",
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
/**
 * Gọi API một cách an toàn, tự động prefix base URL.
 *
 * @param endpoint - Đường dẫn bắt đầu bằng "/", ví dụ "/blogs?page=1"
 * @param options  - RequestInit bình thường (method, body, headers, ...)
 *
 * BE trả về bọc trong { data: ... } hoặc không, hàm này đều xử lý được:
 *   - { data: T }  → trả về T
 *   - T trực tiếp  → trả về T
 */
export async function apiClient<T = unknown>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const res = await fetch(url, {
        credentials: "include",            // gửi cookie httpOnly (session)
        headers: {
            ...DEFAULT_HEADERS,
            ...(options?.headers ?? {}),
        },
        ...options,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(
            json?.message ?? `HTTP ${res.status}`,
            res.status,
            json?.errorCode,
            json?.errors
        );
    }

    // ResponseInterceptor của BE bọc TẤT CẢ trong { statusCode, message, data: T }
    // Nếu json.data tồn tại → unwrap
    if (json !== null && typeof json === "object" && "data" in json) {
        return json.data as T;
    }

    return json as T;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
/** Tạo query string từ object, bỏ qua các giá trị undefined/null/rỗng */
export function buildQuery(
    params: Record<string, string | number | boolean | undefined | null>
): string {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null && val !== "") {
            qs.set(key, String(val));
        }
    }
    const str = qs.toString();
    return str ? `?${str}` : "";
}
