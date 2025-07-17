import { UserProvider } from "@/contexts/user-context";
import "./globals.css"
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />
        <UserProvider>
           {children}
        </UserProvider>
      </body>
    </html>
  );
}
