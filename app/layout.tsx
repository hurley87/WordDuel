import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';

import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@/components/analytics';
import Wagmi from '@/components/wagmi';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: {
    default: 'WordDuel',
    template: `%s | WordDuel`,
  },
  description: 'P2P Social Gaming',
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  authors: [
    {
      name: 'shadcn',
      url: 'https://shadcn.com',
    },
  ],
  creator: 'shadcn',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.mojo.club/',
    title: 'WordDuel',
    description: 'P2P Social Gaming',
    siteName: 'WordDuel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordDuel',
    description: 'P2P Social Gaming',
    images: [`https://www.mojo.club/og.jpg`],
    creator: '@shadcn',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `https://www.mojo.club/site.webmanifest`,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Wagmi>{children}</Wagmi>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
