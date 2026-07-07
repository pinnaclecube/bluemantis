import type { Metadata } from 'next';
import { Newsreader, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { JsonLd, organizationLd, softwareApplicationLd } from '@/lib/jsonld';
import { SITE } from '@/lib/site';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

const HOME_TITLE =
  'Blue Mantis | Autonomous AI Engineering Agents That Ship Reviewed Pull Requests';
const HOME_DESC =
  'Blue Mantis turns tickets into reviewed pull requests. Orchestrated AI agents build, test, and secure the change; your engineers approve it. No new tools.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url), // TODO: confirm production domain
  title: { default: HOME_TITLE, template: '%s | Blue Mantis' },
  description: HOME_DESC,
  applicationName: 'Blue Mantis',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Blue Mantis',
    title: HOME_TITLE,
    description: HOME_DESC,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESC,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${newsreader.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`;
  return (
    <html lang="en" className={fontVars}>
      <body>
        {/* Progressive enhancement: mark JS on before paint so reveals only
            hide when JS is available. Content is visible by default. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
        <a className="skip" href="#main">Skip to content</a>
        <AnnouncementBar />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationLd} />
        <JsonLd data={softwareApplicationLd} />
      </body>
    </html>
  );
}
