import "./globals.css";
import { Suspense } from "react";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { LoadingProvider } from "@/components/shared/LoadingProvider";
export const metadata = {
  title: "AMS",
  description: "Absence Management System",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <ToastProvider>{children}</ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
