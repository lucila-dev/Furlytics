export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pet-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
