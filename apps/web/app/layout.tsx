// app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Danil Kravchenko | Athlete & Coder",
  description: "Hybrid athlete & software engineer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-64H6G758CS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-64H6G758CS');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-black dark:bg-[#0f1418] dark:text-white transition-colors">
        <SpeedInsights/>
        <Analytics/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="min-h-screen bg-white text-black dark:bg-[#0f1418] dark:text-white transition-colors">
            <div className="mx-auto flex min-h-screen flex-col pb-16">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
