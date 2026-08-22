import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espace invités — Jérémie & Jess",
  description:
    "Tout ce qu'il faut pour préparer votre venue au mariage de Jérémie et Jess : don, infos pratiques, album photo, playlist, capsule temporelle, mini-jeux et boîte à souvenirs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${jakarta.variable} antialiased`}
      >
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
