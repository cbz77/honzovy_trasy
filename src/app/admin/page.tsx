
"use client";

import { useEffect, useState } from 'react';
import { getRoutes, deleteRoute, RoutePoint } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, MapPin, ExternalLink, Mountain } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [routes, setRoutes] = useState<RoutePoint[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Auth check simulation
    const user = localStorage.getItem('honzovy_user');
    if (!user) {
      router.push('/login');
      return;
    }
    setRoutes(getRoutes());
  }, [router]);

  const handleDelete = (id: string) => {
    if (confirm('Opravdu chcete tuto trasu smazat?')) {
      deleteRoute(id);
      setRoutes(getRoutes());
      toast({
        title: "Trasa smazána",
        description: "Trasa byla úspěšně odstraněna z katalogu.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Správa tras</h1>
          <p className="text-muted-foreground mt-1">Zde můžete přidávat, upravovat a mazat trasy v katalogu.</p>
        </div>
        <Link href="/admin/new">
          <Button className="bg-primary hover:bg-primary/90 flex gap-2 rounded-full px-6">
            <Plus className="h-5 w-5" />
            Nová trasa
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        {routes.length === 0 ? (
          <div className="text-center py-20">
            <Mountain className="h-16 w-16 mx-auto text-muted mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">Nemáte žádné trasy.</p>
            <Link href="/admin/new">
              <Button variant="link" className="text-primary">Přidejte svou první trasu</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[300px]">Název</TableHead>
                <TableHead>GPS Souřadnice</TableHead>
                <TableHead>Datum vytvoření</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id} className="hover:bg-muted/10">
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Mountain className="h-5 w-5" />
                      </div>
                      {route.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(route.createdAt).toLocaleDateString('cs-CZ')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/routes/${route.id}`}>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-muted hover:bg-muted hover:text-foreground">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 border-muted hover:bg-primary/10 hover:text-primary"
                        onClick={() => router.push(`/admin/edit/${route.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
