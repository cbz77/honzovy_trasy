
"use client";

import { useEffect, useState } from 'react';
import { getRoutes, RoutePoint } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, ArrowRight, Mountain } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [routes, setRoutes] = useState<RoutePoint[]>([]);

  useEffect(() => {
    setRoutes(getRoutes());
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Map Concept */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-muted">
        {/* Placeholder for real map - In a production app, we would use Leaflet or Mapbox here */}
        <div className="absolute inset-0 bg-[#e0e4d0] flex items-center justify-center">
           <div className="relative w-full h-full">
              <Image 
                src="https://picsum.photos/seed/map-placeholder/1920/1080"
                alt="Map Background"
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4 drop-shadow-sm">
                  Objevte krásy přírody
                </h1>
                <p className="text-lg md:text-xl text-foreground max-w-2xl mb-8 bg-background/60 backdrop-blur-sm p-4 rounded-xl">
                  Prozkoumejte nejlepší turistické trasy pečlivě vybrané pro vaše další dobrodružství.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full shadow-lg transition-all hover:scale-105">
                    Začít objevovat
                  </Button>
                </div>
              </div>
           </div>
        </div>
        
        {/* Visual Map Markers */}
        {routes.map((route, i) => (
          <div 
            key={route.id}
            className="absolute hidden md:block cursor-pointer transition-transform hover:scale-110"
            style={{ 
              left: `${15 + (i * 12) % 70}%`, 
              top: `${20 + (i * 15) % 60}%` 
            }}
          >
            <Link href={`/routes/${route.id}`}>
              <div className="bg-accent p-2 rounded-full shadow-lg animate-bounce" style={{ animationDelay: `${i * 0.5}s` }}>
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="mt-1 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold shadow-sm whitespace-nowrap">
                {route.name}
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* Routes List Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground">Doporučené trasy</h2>
            <p className="text-muted-foreground mt-2">Výběr z našich nejnovějších a nejoblíbenějších tras.</p>
          </div>
        </div>

        {routes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-card/50">
            <Mountain className="h-16 w-16 mx-auto text-muted mb-4" />
            <p className="text-xl text-muted-foreground">Zatím jsme nenašli žádné trasy.</p>
            <Link href="/admin/new">
              <Button variant="link" className="text-primary mt-2">Přidejte první trasu v administraci</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {routes.map((route) => (
              <Link key={route.id} href={`/routes/${route.id}`}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-none bg-card/50 backdrop-blur overflow-hidden rounded-3xl">
                  <div className="relative h-48 w-full">
                    {route.images[0] ? (
                      <Image 
                        src={route.images[0]} 
                        alt={route.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="bg-secondary h-full flex items-center justify-center">
                        <Mountain className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Horská trasa
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors flex items-center justify-between">
                      {route.name}
                      <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {route.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                      <MapPin className="h-3 w-3" />
                      {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
