import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, User } from '../types';
import { loginUser, getMe } from '../lib/api';

interface AuthContextType {
    user: User | null;
    role: Role | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    const u = userData.data;
                    const r = u.role.toLowerCase() as Role;
                    setRole(r);
                    setUser({
                        id: u._id,
                        name: u.name,
                        email: u.email,
                        role: r
                    });
                } catch (error) {
                    console.error("Failed to load user", error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: any) => {
        const res = await loginUser(credentials);
        const token = res.token;
        localStorage.setItem('token', token);
        
        const userData = await getMe();
        const u = userData.data;
        const r = u.role.toLowerCase() as Role;
        
        setRole(r);
        setUser({
            id: u._id,
            name: u.name,
            email: u.email,
            role: r
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
