"use client";

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, MapPin, ExternalLink, Mountain, Loader2, ShieldCheck, User } from 'lucide-react';
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
import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user?.uid]);
  
  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminDocRef);
  
  const isAdmin = useMemo(() => {
    if (isAdminRoleLoading) return undefined;
    return !!adminRole;
  }, [adminRole, isAdminRoleLoading]);

  const routesQuery = useMemoFirebase(() => {
    // Čekáme, dokud nevíme jistě stav uživatele a jeho role
    // Pokud je isAdmin undefined, ještě nevíme, zda je uživatel admin nebo ne
    if (!db || !user || isUserLoading || isAdmin === undefined) return null;
    
    const collectionRef = collection(db, 'published_route_points');
    
    if (isAdmin) {
      // Admin vidí vše
      return query(collectionRef, orderBy('createdAt', 'desc'));
    } else {
      // Běžný uživatel vidí jen své
      return query(
        collectionRef, 
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }
  }, [db, user?.uid, isUserLoading, isAdmin]);

  const { data: routes, isLoading: isRoutesLoading } = useCollection(routesQuery);

  const handleDelete = (id: string) => {
    if (confirm('Opravdu chcete tuto trasu smazat?')) {
      const docRef = doc(db, 'published_route_points', id);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Trasa smazána",
        description: "Trasa byla úspěšně odstraněna z katalogu.",
      });
    }
  };

  if (isUserLoading || isAdmin === undefined) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-headline font-bold text-foreground">Správa tras</h1>
            {isAdmin && (
              <Badge variant="secondary" className="flex gap-1 items-center bg-primary/10 text-primary border-none">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Jako administrátor vidíte a můžete spravovat trasy všech uživatelů." 
              : "Zde můžete spravovat trasy, které jste vytvořili."}
          </p>
        </div>
        <Link href="/admin/new">
          <Button className="bg-primary hover:bg-primary/90 flex gap-2 rounded-full px-6">
            <Plus className="h-5 w-5" />
            Nová trasa
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        {isRoutesLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !routes || routes.length === 0 ? (
          <div className="text-center py-20">
            <Mountain className="h-16 w-16 mx-auto text-muted mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">Zatím zde nejsou žádné trasy k zobrazení.</p>
            <Link href="/admin/new">
              <Button variant="link" className="text-primary">Přidejte svou první trasu</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[300px]">Název</TableHead>
                {isAdmin && <TableHead>Autor (UID)</TableHead>}
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
                      <span className="truncate max-w-[200px]">{route.name}</span>
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[120px]">
                        <User className="h-3.5 w-3.5" />
                        {route.createdBy === user?.uid ? "Vy (Admin)" : (route.createdBy || "Anonym")}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      {route.latitude?.toFixed(4)}, {route.longitude?.toFixed(4)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {route.createdAt ? new Date(route.createdAt).toLocaleDateString('cs-CZ') : '-'}
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