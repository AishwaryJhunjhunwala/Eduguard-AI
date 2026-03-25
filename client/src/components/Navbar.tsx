import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
    onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { alerts } = useNotifications(user);
    const [showNotifications, setShowNotifications] = useState(false);

    const unreadAlertsCount = alerts.filter((alert) => alert.status === 'Open').length;

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>

            {/* Search bar */}
            <div className="w-full flex-1">
                <form>
                    <div className="relative group max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="search"
                            placeholder="Search students, courses, or events..."
                            className="w-full appearance-none bg-muted/50 border-none pl-9 focus-visible:ring-1 focus-visible:bg-background transition-all shadow-none rounded-full h-9"
                        />
                    </div>
                </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative rounded-full text-muted-foreground hover:text-foreground"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadAlertsCount > 0 && (
                            <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                        )}
                        <span className="sr-only">Toggle notifications</span>
                    </Button>

                    <NotificationDropdown
                        alerts={alerts}
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                {/* User profile */}
                <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-3 ml-1 cursor-pointer hover:bg-muted/50 p-1.5 px-2 rounded-full transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-sm border border-primary/20">
                        <span className="text-sm font-medium">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </span>
                    </div>
                    <div className="hidden flex-col md:flex items-start">
                        <span className="text-sm font-semibold leading-none">
                            {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 capitalize">
                            {user?.role || 'Guest'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};