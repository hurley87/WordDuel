import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';

import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@/components/analytics';
import Privy from '@/components/privy';

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
  description: 'Play Wordle against your friends for ETH',
  authors: [
    {
      name: 'davidhurley87',
      url: 'https://twitter.com/davidhurley87',
    },
  ],
  creator: 'davidhurley87',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.wordduel.xyz/',
    title: 'WordDuel',
    description: 'Play Wordle against your friends for ETH',
    siteName: 'WordDuel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordDuel',
    description: 'Play Wordle against your friends for ETH',
    creator: '@davidhurley87',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-y-hidden overflow-x-hidden',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Privy>{children}</Privy>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
