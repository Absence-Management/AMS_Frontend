import "./globals.css";
import { ToastProvider } from "@/components/shared/ToastProvider";

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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
