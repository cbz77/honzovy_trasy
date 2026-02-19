
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Compass, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating login
    setTimeout(() => {
      localStorage.setItem('honzovy_user', JSON.stringify({ email }));
      toast({
        title: "Přihlášení úspěšné",
        description: "Vítejte v administraci Honzových tras.",
      });
      setIsLoading(false);
      window.location.href = '/admin';
    }, 1000);
  };

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
              {isLoading ? <LogIn className="h-5 w-5 animate-pulse" /> : <ShieldCheck className="h-5 w-5" />}
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
