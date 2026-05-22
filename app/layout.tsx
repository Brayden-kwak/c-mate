import type { Metadata } from "next";
import { pretendard } from "./_fonts/pretendard";
import "./globals.css";

export const metadata: Metadata = {
  title: "cmate",
  description: "크리스천메이트",
  icons: {
    icon: [{ url: "/images/header-logo.svg", type: "image/svg+xml" }],
    shortcut: "/images/header-logo.svg",
    apple: "/images/header-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
