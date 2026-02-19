
"use client";

import Link from 'next/link';
import { Map, LayoutDashboard, LogIn, UserPlus, LogOut, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">Honzovy trasy</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </Button>
          </Link>
          
          {user ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Administrace</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Odhlásit</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LogIn className="h-4 w-4" />
                  Přihlásit
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="flex gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" />
                  Registrovat
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
