import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

const cities = [
  { id: 'bangalore', name: 'Bangalore' },
  { id: 'mumbai', name: 'Mumbai' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'pune', name: 'Pune' },
  { id: 'hyderabad', name: 'Hyderabad' }
];

export function CitySearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const selectCity = (cityId: string, cityName: string) => {
    // Dispatch a global event so App can pick it up and navigate
    window.dispatchEvent(new CustomEvent('city-selected', { detail: { cityId, cityName } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Search Cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md"
                  onClick={() => selectCity(c.id, c.name)}
                >
                  {c.name}
                </button>
              ))}
              {filtered.length === 0 && <div className="text-sm text-muted-foreground px-3">No cities found</div>}
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
