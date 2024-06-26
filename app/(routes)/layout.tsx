import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MantineProviderComponent from "../_components/providers/MantineProvider";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import ToastProvider from "../_components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PSE Stock Profile",
  description: "Track your PSE stocks transactions and dividends here.",
  icons: {
    icon: { url: "/appicon.ico" },
    apple: { url: "/apple-touch-icon.png" }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProviderComponent>
          <ToastProvider />
          { children }
        </MantineProviderComponent>
      </body>
    </html>
  );
}
