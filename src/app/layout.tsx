
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Honzovy trasy | Katalog turistických tras',
  description: 'Objevujte nejkrásnější turistické trasy s Honzou.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <footer className="border-t bg-card py-8 px-4 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Honzovy trasy. Všechna práva vyhrazena.</p>
          </footer>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
