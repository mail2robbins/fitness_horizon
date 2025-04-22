import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth"
import { headers } from 'next/headers'
import AuthProvider from '@/components/AuthProvider'
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Health & Fitness App',
  description: 'Track your health and fitness journey',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
