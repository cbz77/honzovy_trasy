
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRouteById, RoutePoint } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Camera, Mountain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RouteDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState<RoutePoint | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      setRoute(getRouteById(id) || null);
    }
  }, [id]);

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

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Embedded Map Header */}
      <section className="w-full h-[50vh] relative">
        <iframe
          src={route.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[20%] brightness-95"
        ></iframe>
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="secondary" size="sm" className="shadow-lg backdrop-blur-md bg-white/80 hover:bg-white flex gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zpět na mapu
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 backdrop-blur-sm">
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
                  <span>{route.latitude.toFixed(6)}, {route.longitude.toFixed(6)}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Přidáno: {new Date(route.createdAt).toLocaleDateString('cs-CZ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                <h3 className="font-headline font-bold mb-4 text-primary">Informace</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground">Náročnost</span>
                    <span className="font-semibold">Střední</span>
                  </li>
                  <li className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground">Typ trasy</span>
                    <span className="font-semibold">Okružní</span>
                  </li>
                  <li className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground">Doprava</span>
                    <span className="font-semibold">Auto / Bus</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          {route.images && route.images.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-headline font-bold mb-8 text-foreground flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                Fotogalerie
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {route.images.map((image, index) => (
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
