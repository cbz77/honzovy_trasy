
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignIn, initiateGoogleSignIn } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Compass, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirectChecking, setIsRedirectChecking] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Debug log auth state
  useEffect(() => {
    console.log("Login: Stav uživatele se změnil:", { user: user?.uid, isUserLoading });
  }, [user, isUserLoading]);

  // Handle Google Redirect Result
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return;
      
      console.log("Login: Kontroluji výsledek Google redirectu...");
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Login: Úspěšně zachycen Google uživatel:", result.user.uid);
          // Sync happens in separate useEffect when 'user' updates
        } else {
          console.log("Login: Žádný výsledek redirectu (pokračuji běžně)");
        }
      } catch (error: any) {
        console.error("Login: Chyba při zpracování přesměrování Google:", error);
        toast({
          variant: "destructive",
          title: "Chyba přihlášení",
          description: error.message || "Nepodařilo se dokončit přihlášení přes Google.",
        });
      } finally {
        setIsRedirectChecking(false);
      }
    };
    handleRedirectResult();
  }, [auth, toast]);

  // Sync user data to Firestore and redirect to admin
  useEffect(() => {
    const syncUser = async () => {
      if (user && db) {
        console.log("Login: Synchronizuji uživatele do Firestore a přesměrovávám...", user.uid);
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            lastLogin: new Date().toISOString(),
          }, { merge: true });
          
          router.push('/admin');
        } catch (error) {
          console.error("Login: Chyba při synchronizaci uživatele:", error);
        }
      }
    };
    syncUser();
  }, [user, db, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Login: Spouštím e-mailové přihlášení:", email);
    
    try {
      await initiateEmailSignIn(auth, email, password);
    } catch (error: any) {
      console.error("Login: Chyba e-mailového přihlášení:", error);
      toast({
        variant: "destructive",
        title: "Chyba přihlášení",
        description: error.message || "Zkontrolujte e-mail a heslo.",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    console.log("Login: Spouštím Google Redirect přihlášení...");
    try {
      await initiateGoogleSignIn(auth);
    } catch (error: any) {
      console.error("Login: Chyba při spouštění Google přihlášení:", error);
      toast({
        variant: "destructive",
        title: "Chyba přihlášení",
        description: "Nepodařilo se spustit Google přihlášení.",
      });
      setIsLoading(false);
    }
  };

  if (isUserLoading || isRedirectChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Ověřuji přihlášení...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Přesměrovávám do administrace...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[calc(100vh-160px)]">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden">
        <div className="bg-primary p-8 text-center text-primary-foreground">
          <Compass className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-headline font-bold">Vítejte zpět</h1>
          <p className="opacity-80 text-sm mt-2">Přihlaste se pro správu vašich tras</p>
        </div>
        <CardHeader className="pt-8">
          <CardTitle className="text-xl">Přihlášení</CardTitle>
          <CardDescription>Zadejte své údaje pro přístup do administrace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="jmeno@priklad.cz" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl flex gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              Přihlásit se
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Nebo</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline"
            className="w-full h-12 rounded-xl border-2 hover:bg-muted flex gap-3 font-semibold"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Přihlásit se přes Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Nemáte účet? <Button variant="link" className="p-0 text-primary" onClick={() => router.push('/register')}>Zaregistrujte se</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
