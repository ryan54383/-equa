export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="water-bg min-h-screen flex items-center justify-center p-4">
      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-water-600/10 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-water-400/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
