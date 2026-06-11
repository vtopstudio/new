import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "DesignMate AI — AI + Human дизайн",
  description: "Готовые дизайн-материалы для бизнеса с помощью ИИ и контроля человека."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body><Header />{children}</body></html>;
}
