
"use client";

import { useParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Camera, Mountain, Map as MapIcon, Gauge, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RouteDetail() {
  const { id } = useParams();
  const db = useFirestore();
  const routeRef = id ? doc(db, 'published_route_points', id as string) : null;
  const { data: route, isLoading } = useDoc(routeRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Trasa nebyla nalezena.</h2>
        <Link href="/">
          <Button variant="outline">Zpět na hlavní stránku</Button>
        </Link>
      </div>
    );
  }

  const heroImage = route.images && route.images.length > 0 
    ? route.images[0] 
    : "https://picsum.photos/seed/route-placeholder/1200/800";

  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="w-full h-[60vh] relative">
        <Image 
          src={heroImage} 
          alt={route.name}
          fill
          className="object-cover"
          priority
          data-ai-hint="mountain landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background/90" />
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="secondary" size="sm" className="shadow-lg backdrop-blur-md bg-white/80 hover:bg-white flex gap-2 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Zpět na hlavní stránku
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-12 border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <Mountain className="h-5 w-5" />
                <span>Turistická trasa</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">
                {route.name}
              </h1>
              <div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{route.latitude?.toFixed(6)}, {route.longitude?.toFixed(6)}</span>
                </div>
                {route.createdAt && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Přidáno: {new Date(route.createdAt).toLocaleDateString('cs-CZ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-headline font-bold mb-6 text-foreground flex items-center gap-2">
                O trase
              </h2>
              <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {route.description}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-headline font-bold mb-4 text-primary">Detaily</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Gauge className="h-4 w-4" /> Náročnost
                    </span>
                    <span className="font-semibold">{route.difficulty || 'Střední'}</span>
                  </li>
                  <li className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapIcon className="h-4 w-4" /> Typ trasy
                    </span>
                    <span className="font-semibold">{route.routeType || 'Okružní'}</span>
                  </li>
                  <li className="flex flex-col gap-2 border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Vhodné pro
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {route.suitableFor && route.suitableFor.length > 0 ? (
                        route.suitableFor.map((item: string, i: number) => (
                          <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="font-semibold">Všechny</span>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {route.embedUrl && (
            <div className="mt-12 mb-16">
              <h2 className="text-2xl font-headline font-bold mb-6 text-foreground flex items-center gap-2">
                <MapIcon className="h-6 w-6 text-primary" />
                Interaktivní mapa
              </h2>
              <div className="rounded-3xl overflow-hidden shadow-lg border bg-muted aspect-video relative">
                <div 
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: route.embedUrl }} 
                />
              </div>
            </div>
          )}

          {route.images && route.images.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-headline font-bold mb-8 text-foreground flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                Fotogalerie
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {route.images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-md transition-all hover:shadow-xl"
                  >
                    <Image
                      src={image}
                      alt={`${route.name} foto ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
