import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PageHeader } from '../components/ui/page-header';
import { User, Mail, Building, Phone, Save, GraduationCap, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export const Profile = () => {
    const { user, role } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Mock save delay
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-in fade-in duration-500">
            <PageHeader
                title="Personal Profile"
                description="View and update your personal information."
                badge={
                    <Badge variant="outline" className="gap-1.5 px-3 py-1">
                        {role === 'student' ? <GraduationCap className="h-4 w-4 text-primary" /> : <ShieldCheck className="h-4 w-4 text-primary" />}
                        {role === 'admin' ? 'Administrator' : role === 'mentor' ? 'Faculty Member' : role === 'counselor' ? 'Counselor' : 'Student'}
                    </Badge>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm h-fit">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
                            {user?.name ? (
                                <span className="text-4xl text-primary font-bold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            ) : (
                                <User className="h-12 w-12 text-primary/50" />
                            )}
                        </div>
                        <CardTitle className="text-2xl">{user?.name || 'User Name'}</CardTitle>
                        <CardDescription className="text-base">
                            {user?.email || 'email@example.com'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 flex justify-center">
                        <Button variant="outline" size="sm" className="w-full">Change Avatar</Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Account Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="profile-form" onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground/90">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input defaultValue={user?.name} className="pl-9 bg-muted/30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground/90">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="email" defaultValue={user?.email} className="pl-9 bg-muted/30" disabled />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-1">Email cannot be changed.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground/90">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="tel" placeholder="+1 (555) 000-0000" className="pl-9 bg-muted/30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground/90">Department</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            defaultValue={role === 'student' ? 'Computer Science' : 'University Administration'}
                                            className="pl-9 bg-muted/30"
                                            disabled={role === 'student'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/10 rounded-b-xl">
                        <Button variant="outline" type="button">Discard</Button>
                        <Button type="submit" form="profile-form" disabled={isSaving} className="min-w-[120px]">
                            {isSaving ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
