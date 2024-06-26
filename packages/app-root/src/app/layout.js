import RootLayout from '@/components/RootLayout'
import StyledComponentsRegistry from './style-registry'

export const metadata = {
  title: {
    template: '%s | Zooniverse',
    default: 'Zooniverse'
  },
  description: `The Zooniverse is the world's largest and most popular platform for people-powered research.`,
  keywords: ['Zooniverse', 'Research'],
  openGraph: {
    images: 'https://static.zooniverse.org/assets/zooniverse-icon-web-black.png'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/touch-icon.png'
  },
  twitter: {
    card: 'summary',
    creator: '@the_zooniverse'
  }
}

export default function NextLayout({ children }) {
  return (
    <html lang='en'>
      <StyledComponentsRegistry>
        <RootLayout>{children}</RootLayout>
      </StyledComponentsRegistry>
    </html>
  )
}
