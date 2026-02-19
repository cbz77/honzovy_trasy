
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Chyba hesla",
        description: "Hesla se neshodují.",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulating registration
    setTimeout(() => {
      localStorage.setItem('honzovy_user', JSON.stringify({ email: formData.email, name: formData.name }));
      toast({
        title: "Registrace úspěšná",
        description: "Váš účet byl vytvořen. Vítejte v týmu!",
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
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl mt-4 flex gap-2"
              disabled={isLoading}
            >
              {isLoading ? <UserPlus className="h-5 w-5 animate-pulse" /> : <UserPlus className="h-5 w-5" />}
              Vytvořit účet
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Již máte účet? <Button variant="link" className="p-0 text-primary" onClick={() => router.push('/login')}>Přihlaste se</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
