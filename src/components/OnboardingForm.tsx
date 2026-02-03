import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

type OnboardingFormProps = {
    onComplete: (data: {
        fullName: string;
        city: string;
        cityName: string;
        organization?: string;
    }) => void;
};

const CITIES = [
    { id: 'pune', name: 'Pune' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'delhi', name: 'Delhi' },
];

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
    const [fullName, setFullName] = useState('');
    const [organization, setOrganization] = useState('');
    const [city, setCity] = useState('');
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !city) {
            setError('Full name and city are required');
            return;
        }

        setError('');

        onComplete({
            fullName: fullName.trim(),
            city,
            cityName,
            organization: organization.trim() || undefined,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Welcome to <span className="text-primary">LOOK.IN</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                        Let’s set up your profile
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                            <Label>Location (City) *</Label>
                            <Select
                                onValueChange={(value) => {
                                    const selected = CITIES.find((c) => c.id === value);
                                    setCity(value);
                                    setCityName(selected?.name || '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CITIES.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Choose the city where you’re looking for flatmates
                            </p>
                        </div>

                        {/* Organization */}
                        <div className="space-y-1">
                            <Label htmlFor="organization">Organization (optional)</Label>
                            <Input
                                id="organization"
                                placeholder="College / Company / Hostel"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        {/* Submit */}
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
