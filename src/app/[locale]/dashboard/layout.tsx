export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4">{children}</main>
  );
}
