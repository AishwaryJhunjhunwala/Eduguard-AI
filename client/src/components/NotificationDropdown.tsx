import { Button } from './ui/button';
import { useEffect, useRef } from 'react';
import type { NotificationAlert } from '../hooks/useNotifications';

interface NotificationDropdownProps {
    alerts: NotificationAlert[];
    isOpen: boolean;
    onClose: () => void;
}

const getSeverityColor = (severity: NotificationAlert['severity']) => {
    switch (severity) {
        case 'Critical': return 'bg-destructive';
        case 'High': return 'bg-orange-500';
        case 'Medium': return 'bg-yellow-500';
        default: return 'bg-green-500';
    }
};

const getStatusColor = (status: NotificationAlert['status']) => {
    switch (status) {
        case 'Open': return 'bg-destructive/10 text-destructive';
        case 'In Progress': return 'bg-yellow-500/10 text-yellow-700';
        default: return 'bg-green-500/10 text-green-700';
    }
};

export const NotificationDropdown = ({ alerts, isOpen, onClose }: NotificationDropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="notification-dropdown absolute top-16 right-4 w-80 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">{alerts.length} total alert{alerts.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No alerts at this time</div>
                ) : (
                    alerts.slice(0, 10).map((alert) => (
                        <div key={alert._id} className="p-3 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-block w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`}></span>
                                        <span className="text-sm font-medium">{alert.type} Alert</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(alert.status)}`}>{alert.status}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                                    {alert.student && (
                                        <p className="text-xs text-muted-foreground mt-1">Student: {alert.student.studentId}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {alerts.length > 10 && (
                <div className="p-3 text-center border-t border-border">
                    <Button variant="ghost" size="sm" className="text-sm">View all notifications</Button>
                </div>
            )}
        </div>
    );
};
