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

// ─── Silent Refresh State ──────────────────────────────────────────────────────
// Tránh gọi /auth/refresh nhiều lần song song (chỉ gọi 1 lần, các request khác chờ)
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Gọi /auth/refresh để lấy access token mới.
 * Trả về true nếu thành công, false nếu refresh token đã hết hạn.
 */
async function silentRefresh(): Promise<boolean> {
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            return res.ok;
        } catch {
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
/**
 * Gọi API một cách an toàn, tự động prefix base URL.
 * Khi nhận 401 → tự động gọi /auth/refresh → retry request gốc (1 lần).
 * Nếu refresh fail → redirect về /login.
 *
 * @param endpoint - Đường dẫn bắt đầu bằng "/", ví dụ "/blogs?page=1"
 * @param options  - RequestInit bình thường (method, body, headers, ...)
 */
export async function apiClient<T = unknown>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const makeRequest = () =>
        fetch(url, {
            credentials: "include",            // gửi cookie httpOnly (session)
            headers: {
                ...DEFAULT_HEADERS,
                ...(options?.headers ?? {}),
            },
            ...options,
        });

    let res = await makeRequest();

    // ── Silent Token Refresh ─────────────────────────────────────────────────
    // Chỉ thực hiện phía browser (không refresh nếu là SSR/server component)
    if (res.status === 401 && !isServer && !endpoint.includes("/auth/refresh")) {
        const refreshed = await silentRefresh();

        if (refreshed) {
            // Retry request gốc với access token mới (đã set trong cookie)
            res = await makeRequest();
        } else {
            // Refresh token hết hạn → buộc đăng nhập lại
            if (typeof window !== "undefined") {
                // Tránh loop: Chỉ redirect nếu KHÔNG ở trang login
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login?reason=session_expired";
                }
            }
            throw new ApiError("Phiên đăng nhập đã hết hạn", 401);
        }
    }
    // ────────────────────────────────────────────────────────────────────────

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
