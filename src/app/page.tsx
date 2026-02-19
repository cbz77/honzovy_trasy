
"use client";

import { useEffect, useState, useMemo } from 'react';
import { getRoutes, RoutePoint } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { MapPin, ArrowRight, Mountain, X, Search } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [routes, setRoutes] = useState<RoutePoint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSuitable, setFilterSuitable] = useState<string>('all');

  useEffect(() => {
    setRoutes(getRoutes());
  }, []);

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || route.difficulty === filterDifficulty;
      const matchesType = filterType === 'all' || route.routeType === filterType;
      const matchesSuitable = filterSuitable === 'all' || (route.suitableFor && route.suitableFor.includes(filterSuitable));
      
      return matchesSearch && matchesDifficulty && matchesType && matchesSuitable;
    });
  }, [routes, searchTerm, filterDifficulty, filterType, filterSuitable]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDifficulty('all');
    setFilterType('all');
    setFilterSuitable('all');
  };

  const hasActiveFilters = searchTerm !== '' || filterDifficulty !== 'all' || filterType !== 'all' || filterSuitable !== 'all';

  return (
    <div className="flex flex-col">
      {/* Hero Section with Beautiful Landscape Background */}
      <section className="relative h-[65vh] w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/hero-czech/1920/1080"
            alt="Česká krajina"
            fill
            className="object-cover"
            priority
            data-ai-hint="czech landscape"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl bg-background/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl transition-all hover:bg-background/90">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 leading-tight">
              Objevte krásy přírody
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Prozkoumejte náš pečlivě vybraný katalog turistických tras a výletů po celé České republice. Od lehkých procházek po náročné hřebenovky.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full shadow-lg transition-all hover:scale-105" 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Prohlédnout katalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Routes Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 py-16">
        <div className="flex flex-col mb-10">
          <h2 className="text-3xl font-headline font-bold text-foreground">Katalog tras</h2>
          <p className="text-muted-foreground mt-2">Filtrujte trasy podle vašich preferencí a náročnosti.</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-[2rem] border mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Vyhledat</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Název trasy..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Náročnost</label>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Všechny" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny</SelectItem>
                  <SelectItem value="Lehká">Lehká</SelectItem>
                  <SelectItem value="Střední">Střední</SelectItem>
                  <SelectItem value="Obtížná">Obtížná</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Typ trasy</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Všechny" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny</SelectItem>
                  <SelectItem value="Okružní">Okružní</SelectItem>
                  <SelectItem value="Přechod">Přechod</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Vhodné pro</label>
              <Select value={filterSuitable} onValueChange={setFilterSuitable}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Všechny" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny</SelectItem>
                  <SelectItem value="pěší">Pěší</SelectItem>
                  <SelectItem value="cyklisté">Cyklisté</SelectItem>
                  <SelectItem value="rodiny">Rodiny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex justify-end mt-4">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary rounded-full">
                <X className="h-3 w-3 mr-1" /> Vymazat filtry
              </Button>
            </div>
          )}
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-[3rem] bg-card/30">
            <Mountain className="h-16 w-16 mx-auto text-muted mb-4 opacity-40" />
            <p className="text-xl text-muted-foreground">Žádné trasy neodpovídají vybraným filtrům.</p>
            <Button variant="link" onClick={resetFilters} className="text-primary mt-2">Zrušit všechny filtry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoutes.map((route) => (
              <Link key={route.id} href={`/routes/${route.id}`}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-none bg-card/60 backdrop-blur overflow-hidden rounded-[2.5rem] flex flex-col">
                  <div className="relative h-56 w-full">
                    {route.images && route.images[0] ? (
                      <Image 
                        src={route.images[0]} 
                        alt={route.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="bg-secondary h-full flex items-center justify-center">
                        <Mountain className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {route.difficulty}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      {route.routeType}
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="group-hover:text-primary transition-colors flex items-center justify-between text-xl font-headline font-bold">
                      {route.name}
                      <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3 text-primary" />
                      {route.latitude.toFixed(4)}, {route.longitude.toFixed(4)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                      {route.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {route.suitableFor && route.suitableFor.map((tag, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
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
