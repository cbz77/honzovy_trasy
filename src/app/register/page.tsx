
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Compass, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [captchaValue, setCaptchaValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [captchaQuestion, setCaptchaQuestion] = useState({ a: 0, b: 0 });
  
  const generateCaptcha = () => {
    setCaptchaQuestion({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaValue('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Debugging auth state
  useEffect(() => {
    console.log("Register: Stav uživatele se změnil:", { user: user?.uid, isUserLoading });
  }, [user, isUserLoading]);

  // Explicitly check for redirect result on mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return;
      console.log("Register: Kontroluji výsledek Google redirectu...");
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Register: Úspěšná registrace/přihlášení přes Google:", result.user.uid);
        } else {
          console.log("Register: Žádný výsledek redirectu");
        }
      } catch (error: any) {
        console.error("Register: Chyba při zpracování přesměrování Google:", error);
      }
    };
    handleRedirectResult();
  }, [auth]);

  // Handle synchronization and redirection after registration
  useEffect(() => {
    const syncUser = async () => {
      if (user && !isUserLoading && db) {
        console.log("Register: Synchronizuji nového uživatele do Firestore...", user.uid);
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: formData.name || user.displayName || 'Nový dobrodruh',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          }, { merge: true });
          
          console.log("Register: Synchronizace OK, přesměrovávám do /admin");
          router.push('/admin');
        } catch (error) {
          console.error("Register: Sync user error:", error);
        }
      }
    };
    syncUser();
  }, [user, isUserLoading, db, router, formData.name]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(captchaValue) !== (captchaQuestion.a + captchaQuestion.b)) {
      toast({
        variant: "destructive",
        title: "Chyba ověření",
        description: "Výsledek příkladu není správný.",
      });
      generateCaptcha();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Chyba hesla",
        description: "Hesla se neshodují.",
      });
      return;
    }

    setIsLoading(true);
    console.log("Register: Spouštím e-mailovou registraci:", formData.email);
    try {
      await initiateEmailSignUp(auth, formData.email, formData.password);
    } catch (error: any) {
      console.error("Register: Chyba při registraci:", error);
      toast({
        variant: "destructive",
        title: "Chyba registrace",
        description: error.message || "Nepodařilo se vytvořit účet.",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    console.log("Register: Spouštím Google Redirect registraci...");
    try {
      await initiateGoogleSignIn(auth);
    } catch (error: any) {
      console.error("Register: Chyba Google registrace:", error);
      toast({
        variant: "destructive",
        title: "Chyba registrace",
        description: "Nepodařilo se spustit Google registraci.",
      });
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Ověřuji registraci...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Vítejte! Přesměrovávám do administrace...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[calc(100vh-160px)]">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden">
        <div className="bg-primary p-8 text-center text-primary-foreground">
          <Compass className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-headline font-bold">Nové dobrodružství</h1>
          <p className="opacity-80 text-sm mt-2">Vytvořte si účet a sdílejte své trasy</p>
        </div>
        <CardHeader className="pt-8">
          <CardTitle className="text-xl text-center">Registrace</CardTitle>
          <CardDescription className="text-center">Vyplňte formulář níže pro vytvoření účtu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Jméno a příjmení</Label>
              <Input 
                id="name" 
                placeholder="Jan Novák" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="jmeno@priklad.cz" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potvrdit heslo</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="captcha">Ochrana proti robotům: Kolik je {captchaQuestion.a} + {captchaQuestion.b}?</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground"
                  onClick={generateCaptcha}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <Input 
                id="captcha" 
                placeholder="Váš výsledek" 
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl mt-4 flex gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
              Vytvořit účet
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
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Registrovat se přes Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Již máte účet? <Button variant="link" className="p-0 text-primary" onClick={() => router.push('/login')}>Přihlaste se</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
