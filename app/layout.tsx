import {Inter, Space_Grotesk} from "next/font/google";
import type {Metadata} from "next";
import './globals.css'
import "../styles/prism.css"
import {ThemeProvider} from "@/context/ThemeProvider";
import {ClerkProvider} from "@clerk/nextjs";


const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '300', '400', '500', '600', '700'],
    variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-spaceGrotesk',
})
export const metadata: Metadata = {
    title: 'Ask me anything about languages',
    description: 'A place to learn and build your skills',
    icons: {
        icon: '/logo.svg',
    },
}



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    formButtonPrimary: 'primary-gradient',
                    footerActionLink:
                        'primary-text-gradient hover:text-primary-500',
                }
            }}
        >
            <html lang="en">
            <body
                className={`${inter.variable} ${spaceGrotesk.variable} `}
            >
            <ThemeProvider>
                {children}
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}