import AppProvider from "@/providers/app-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFTune - Music for NFT Growers",
  description: "Listen while your NFTs grow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <body className={`${inter.className} bg-black text-white h-screen overflow-hidden`}>
          {children}
        </body>
      </AppProvider>
    </html>
  )
}