"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveRoute } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Upload, X, Loader2, Map as MapIcon, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { generateRouteDescription } from '@/ai/flows/generate-route-description';
import Image from 'next/image';

export default function NewRoute() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    embedUrl: '',
    description: '',
    images: [] as string[]
  });

  useEffect(() => {
    // Auth check
    const user = localStorage.getItem('honzovy_user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.images.length + files.length > 6) {
      toast({
        variant: "destructive",
        title: "Limit překročen",
        description: "Můžete nahrát maximálně 6 fotografií.",
      });
      return;
    }

    // Convert to base64 for demo purposes (usually you'd upload to a server/S3)
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string].slice(0, 6)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateAIContent = async () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        variant: "destructive",
        title: "Chybějící údaje",
        description: "Pro vygenerování popisu vyplňte název a souřadnice.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateRouteDescription({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      
      if (result && result.description) {
        setFormData(prev => ({ ...prev, description: result.description }));
        toast({
          title: "Popis vygenerován",
          description: "AI úspěšně vytvořila popis trasy.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Chyba AI",
        description: "Nepodařilo se vygenerovat popis. Zkuste to prosím znovu.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.latitude || !formData.longitude || !formData.embedUrl) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Prosím vyplňte všechna povinná pole.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      saveRoute({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        embedUrl: formData.embedUrl,
        description: formData.description,
        images: formData.images
      });

      toast({
        title: "Trasa uložena",
        description: "Nová trasa byla úspěšně přidána do katalogu.",
      });
      router.push('/admin');
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Při ukládání došlo k chybě.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4 hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zpět na přehled
          </Button>
        </Link>
        <h1 className="text-3xl font-headline font-bold text-foreground">Přidat novou trasu</h1>
        <p className="text-muted-foreground">Vyplňte formulář níže pro vytvoření nového bodu na mapě.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Základní informace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Název trasy / bodu *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Např. Vyhlídka u jezera" 
                value={formData.name}
                onChange={handleInputChange}
                required
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Zeměpisná šířka (Latitude) *</Label>
                <Input 
                  id="latitude" 
                  name="latitude" 
                  type="number" 
                  step="any"
                  placeholder="50.0755" 
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Zeměpisná délka (Longitude) *</Label>
                <Input 
                  id="longitude" 
                  name="longitude" 
                  type="number" 
                  step="any"
                  placeholder="14.4378" 
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Embed */}
        <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Mapa a interakce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embedUrl">Embed URL mapy (Google Maps / Mapy.cz) *</Label>
              <Input 
                id="embedUrl" 
                name="embedUrl" 
                placeholder="https://www.google.com/maps/embed?..." 
                value={formData.embedUrl}
                onChange={handleInputChange}
                required
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Získejte kód pro vložení na Google Maps (Sdílet {"->"} Vložit mapu {"->"} zkopírujte URL z atributu src).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Description with AI */}
        <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Popis trasy
            </CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="text-primary border-primary/20 hover:bg-primary/10 rounded-full gap-2"
              onClick={generateAIContent}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Pomoc AI
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea 
                id="description" 
                name="description" 
                rows={8}
                placeholder="Popište krásy této trasy..." 
                value={formData.description}
                onChange={handleInputChange}
                className="rounded-xl resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Fotografie (max 6)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm group">
                  <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {formData.images.length < 6 && (
                <label className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                  <Upload className="h-8 w-8 text-primary/40 mb-2" />
                  <span className="text-xs font-medium text-primary/60">Nahrát foto</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    disabled={formData.images.length >= 6}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Link href="/admin">
            <Button type="button" variant="ghost" className="rounded-full px-8">Zrušit</Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 rounded-full px-12 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Uložit trasu
          </Button>
        </div>
      </form>
    </div>
  );
}
