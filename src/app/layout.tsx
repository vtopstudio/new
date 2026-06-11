import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "VTop AI Design", description: "AI + Human дизайн-сервис" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ru"><body><Nav />{children}</body></html>; }
