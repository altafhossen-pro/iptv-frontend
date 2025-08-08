
import DevToolsProtection from "@/components/DevToolsProtection/DevToolsProtection";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import Script from "next/script";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "IPTV",
  description: "Bangladesh best IPTV service provider",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AuthProvider>
          {children}
          <DevToolsProtection />
          <Toaster />
        </AuthProvider>
        {/* <Script
          src="https://cdn.jsdelivr.net/npm/hls.js@latest"
          strategy="beforeInteractive"
        /> */}
      </body>
    </html>
  );
}
