
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Compass, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      initiateEmailSignIn(auth, email, password);
      // Auth state change will be handled by FirebaseProvider
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Chyba přihlášení",
        description: error.message || "Zkontrolujte e-mail a heslo.",
      });
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
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
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Nemáte účet? <Button variant="link" className="p-0 text-primary" onClick={() => router.push('/register')}>Zaregistrujte se</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
