export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-screen h-[calc(100vh-3.75rem)] place-content-center items-center">
      {children}
    </div>
  );
}
