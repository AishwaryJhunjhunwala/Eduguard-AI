import { useState, useEffect } from 'react';
import { getAlerts } from '../lib/api';

export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'Open' | 'In Progress' | 'Resolved';

export type NotificationAlert = {
  _id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
  student?: {
    studentId: string;
  };
};

export const useNotifications = (user: any) => {
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await getAlerts();
        setAlerts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  return { alerts, loading };
};
