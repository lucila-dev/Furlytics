import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/session";
import { AuthOriginBanner } from "@/components/AuthOriginBanner";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedSession();
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="pet-bg min-h-screen">
      <AuthOriginBanner />
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
