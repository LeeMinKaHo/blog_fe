import { useMe } from "@/app/hooks/useMe";
import Link from "next/link";


function LoginRequired() {
  return (
    <div className="mt-4 rounded-lg border bg-gray-50 p-4 text-center ">
      <p className="text-sm text-gray-600">
        Please log in to continue
      </p>
      <Link
        href="/login"
        className="mt-2 inline-block rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700 transition-colors"
      >
        Login
      </Link>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  if (!user) {
    return <LoginRequired />;
  }

  return <>{children}</>;
}
