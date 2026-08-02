import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SearchProvider } from "@/context/SearchContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "எமனேரி மீனவன் - புதிய மீன் ஆன்லைன்", // தலைப்பை மாற்றவும்
  description:
    "புதிய கடல் உணவுகளை நேரடியாகக் கடற்கரையில் இருந்து ஆர்டர் செய்யவும்.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta">
      <body className={inter.className}>
         <SearchProvider>
        <ReactQueryProvider>
          
          {/* முக்கிய உள்ளடக்கமானது children-இல்தான் இருக்கும் (page.tsx) */}
          {children}
        </ReactQueryProvider>
         </SearchProvider>
      </body>
    </html>
  );
}
