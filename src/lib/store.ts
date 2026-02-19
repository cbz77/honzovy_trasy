
"use client";

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  embedUrl: string;
  description: string;
  images: string[];
  difficulty: 'Lehká' | 'Střední' | 'Obtížná';
  routeType: 'Okružní' | 'Přechod';
  suitableFor: string[];
  createdAt: string;
}

const STORAGE_KEY = 'honzovy_trasy_data';

export const getRoutes = (): RoutePoint[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveRoute = (route: Omit<RoutePoint, 'id' | 'createdAt'> & { id?: string }) => {
  const routes = getRoutes();
  if (route.id) {
    // Update
    const index = routes.findIndex(r => r.id === route.id);
    if (index > -1) {
      routes[index] = { ...routes[index], ...route } as RoutePoint;
    }
  } else {
    // Create
    const newRoute: RoutePoint = {
      ...route,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    } as RoutePoint;
    routes.push(newRoute);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
};

export const deleteRoute = (id: string) => {
  const routes = getRoutes().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
};

export const getRouteById = (id: string): RoutePoint | undefined => {
  return getRoutes().find(r => r.id === id);
};
