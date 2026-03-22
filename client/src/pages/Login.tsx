import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../store/AuthContext';
import type { Role } from '../types';

type PortalType = 'student' | 'admin';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [activePortal, setActivePortal] = useState<PortalType>('student');
    const [adminRole, setAdminRole] = useState<Role>('admin');

    const [email, setEmail] = useState('student1@eduguard.com');
    const [password, setPassword] = useState('student123');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/');
        } catch (error: any) {
            setErrorMsg(error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50" />
            <div className="absolute top-48 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl -z-10 opacity-30" />

            <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 mb-4 border border-primary/20">
                        <Activity className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">EduGuard AI</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Academic Analytics & Risk Prediction</p>
                </div>

                <Card className="shadow-xl border-border/50 bg-background/80 backdrop-blur-xl">
                    <div className="flex p-1 bg-muted/50 rounded-t-xl border-b border-border/50">
                        <button
                            type="button"
                            onClick={() => {
                                setActivePortal('student');
                                setEmail('aman.verma21@college.edu');
                                setPassword('student123');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activePortal === 'student'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                }`}
                        >
                            <GraduationCap className="h-4 w-4" />
                            Student Portal
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActivePortal('admin');
                                setEmail('admin@eduguard.ai');
                                setPassword('password');
                                setAdminRole('admin');
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activePortal === 'admin'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                }`}
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Staff Portal
                        </button>
                    </div>

                    <CardHeader className="space-y-1 pb-4 pt-6">
                        <CardTitle className="text-xl">
                            {activePortal === 'student' ? 'Welcome back, Student' : 'Staff Access'}
                        </CardTitle>
                        <CardDescription>
                            {activePortal === 'student'
                                ? 'Sign in to view your academic performance and attendance.'
                                : 'Sign in to manage classes and monitor student analytics.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form id="login-form" onSubmit={handleLogin} className="space-y-4">
                            {errorMsg && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                    {errorMsg}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground/90" htmlFor="email">Email address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={activePortal === 'student' ? "e.g. aman.verma21@college.edu" : "staff@college.edu"}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-background/50 focus-visible:ring-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none text-foreground/90" htmlFor="password">Password</label>
                                    <span className="text-xs font-medium text-primary hover:underline cursor-pointer">Forgot password?</span>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background/50 focus-visible:ring-primary/50"
                                />
                            </div>

                            {/* Show role selector only for staff portal to differentiate Admin vs Faculty */}
                            {activePortal === 'admin' && (
                                <div className="space-y-2 pt-2 animate-in slide-in-from-top-2 opacity-100 duration-300">
                                    <label className="text-sm font-medium leading-none text-foreground/90" htmlFor="adminRole">Access Level</label>
                                    <select
                                        id="adminRole"
                                        value={adminRole}
                                        onChange={(e) => setAdminRole(e.target.value as Role)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 text-foreground"
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="faculty">Faculty Member</option>
                                        <option value="counselor">Academic Counselor</option>
                                    </select>
                                </div>
                            )}
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pb-8">
                        <Button type="submit" form="login-form" className="w-full text-md h-11 shadow-md shadow-primary/20" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ''}
                            Sign in to {activePortal === 'student' ? 'Portal' : 'Dashboard'}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground/60 w-full">
                            Secure access provided by EduGuard Authentication
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
