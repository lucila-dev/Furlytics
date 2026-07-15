import { AuthOriginBanner } from "@/components/AuthOriginBanner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pet-bg min-h-screen">
      <AuthOriginBanner />
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
