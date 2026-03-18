import type { Metadata } from 'next'
import { Fraunces, Space_Grotesk } from 'next/font/google'
import './globals.css'

const display = Fraunces({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['500', '600', '700'],
})

const ui = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-ui',
    weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'UK Wind Power Monitor',
    description: 'Live vs Forecast Generation Data from Elexon BMRS',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${display.variable} ${ui.variable}`}>{children}</body>
        </html>
    )
}
