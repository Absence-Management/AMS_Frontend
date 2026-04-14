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

// Inline script that runs before any paint.
// On Windows 125 % DPI the browser's devicePixelRatio = 1.25,
// which shrinks the CSS viewport by 20 % and makes every fixed-size
// element look 25 % larger than on a 100 % Ubuntu screen.
// We counter-act this by zooming <html> down by exactly 1/dpr so the
// visual result matches what was designed at 96 dpi / 100 % scaling.
const dpiScript = `
(function () {
  var dpr = window.devicePixelRatio || 1;
  // Only compensate when the OS is actually scaling (dpr > 1).
  // Keep a small tolerance so that 1.01 rounding noise is ignored.
  if (dpr > 1.05) {
    document.documentElement.style.zoom = String(1 / dpr);
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* DPI-scale compensation — must run synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: dpiScript }} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
