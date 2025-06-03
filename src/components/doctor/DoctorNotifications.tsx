
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, FileText, AlertTriangle, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string;
  read: boolean;
}

export const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Appointment Request',
      message: 'John Doe has requested an appointment for tomorrow at 2:00 PM',
      type: 'info',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Lab Results Available',
      message: 'Blood work results for Alice Smith are now available for review',
      type: 'success',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false
    },
    {
      id: '3',
      title: 'Prescription Refill Request',
      message: 'Michael Johnson has requested a refill for Lisinopril',
      type: 'warning',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true
    },
    {
      id: '4',
      title: 'Appointment Cancelled',
      message: 'Sarah Wilson has cancelled her appointment scheduled for Friday',
      type: 'error',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      read: true
    },
    {
      id: '5',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will occur this weekend from 2 AM to 4 AM',
      type: 'info',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Using demo data instead of fetching from database
    setIsLoading(false);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );

      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-slate-800">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Mark All as Read
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-sm lg:text-base">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-blue-500 bg-blue-50/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {getIconForType(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-800 text-sm lg:text-base truncate">{notification.title}</h4>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge className={`${getBadgeColor(notification.type)} text-xs`}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm lg:text-base mb-2 break-words">{notification.message}</p>
                      <p className="text-xs lg:text-sm text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0 text-xs lg:text-sm"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
