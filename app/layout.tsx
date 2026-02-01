import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wake-Up Gallery Alarm",
  description: "Viral alarm app - wake up or your friends see a random photo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
