import AuthProvider from "@/providers/auth-provider";
import "./globals.css";
import type { Metadata } from "next";
import ToasterProvider from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import ModalProvider from "@/providers/modal-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { QueryProvider } from "@/providers/query-provider";
import getCurrentUser from "@/actions/getCurrentUser";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Tutorial by CodeWithAntonio",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={cn("font-MyNewFont", "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme=""
            enableSystem={false}
            storageKey="Something Unique"
          >
            <SocketProvider user={user!}>
              <ToasterProvider />
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
