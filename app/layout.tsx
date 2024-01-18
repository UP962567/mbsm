import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-providers'
import './globals.css'
import { BookingProvider } from '@/providers/booking-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MBSM Software',
  description: 'BOVA Software',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">

        <body className={inter.className} suppressHydrationWarning={true}>
          <BookingProvider />
          <ModalProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}