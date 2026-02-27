import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { serviceRequestService, ServiceRequest } from '@/services/serviceRequestService';
import { toast } from 'sonner';

interface NotificationState {
  previousRequests: ServiceRequest[];
  unreadNotifications: number;
}

export const useServiceRequestNotifications = () => {
  const { user } = useAuth();
  const [notificationState, setNotificationState] = useState<NotificationState>({
    previousRequests: [],
    unreadNotifications: 0
  });

  const checkForStatusChanges = useCallback(async () => {
    if (!user || user.role !== 'client') return;

    try {
      const currentRequests = await serviceRequestService.getClientServiceRequests(user.id);
      const previousRequests = notificationState.previousRequests;

      // Check for status changes
      let newNotificationsCount = 0;
      currentRequests.forEach(currentRequest => {
        const previousRequest = previousRequests.find(req => req.id === currentRequest.id);
        
        if (previousRequest && previousRequest.status !== currentRequest.status) {
          // Status has changed, show notification
          handleStatusChange(previousRequest.status, currentRequest.status, currentRequest);
          newNotificationsCount++;
        }
      });

      // Update notification count
      if (newNotificationsCount > 0) {
        setNotificationState(prev => ({
          ...prev,
          unreadNotifications: prev.unreadNotifications + newNotificationsCount
        }));
      }

      // Update previous requests
      setNotificationState(prev => ({
        ...prev,
        previousRequests: currentRequests
      }));

    } catch (error) {
      console.error('Error checking service request notifications:', error);
    }
  }, [user, notificationState.previousRequests]);

  const handleStatusChange = (oldStatus: string, newStatus: string, request: ServiceRequest) => {
    if (oldStatus === 'pending' && newStatus === 'approved') {
      toast.success('Service Request Approved!', {
        description: `Your request "${request.title}" has been approved and a project has been created.`,
        duration: 5000,
        icon: '✅'
      });
    } else if (oldStatus === 'pending' && newStatus === 'rejected') {
      toast.error('Service Request Rejected', {
        description: `Your request "${request.title}" has been rejected. Please contact support for more information.`,
        duration: 5000,
        icon: '❌'
      });
    } else if (newStatus === 'active') {
      toast.info('Project Started', {
        description: `Work has begun on your project "${request.title}".`,
        duration: 5000,
        icon: '🚀'
      });
    } else if (newStatus === 'completed') {
      toast.success('Project Completed!', {
        description: `Your project "${request.title}" has been completed successfully.`,
        duration: 5000,
        icon: '🎉'
      });
    }
  };

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      unreadNotifications: 0
    }));
  }, []);

  // Initialize and set up polling
  useEffect(() => {
    if (!user || user.role !== 'client') return;

    // Initial check
    checkForStatusChanges();

    // Set up polling every 30 seconds
    const interval = setInterval(checkForStatusChanges, 30000);

    return () => clearInterval(interval);
  }, [user, checkForStatusChanges]);

  // Manual refresh function
  const refreshNotifications = useCallback(() => {
    checkForStatusChanges();
  }, [checkForStatusChanges]);

  return {
    refreshNotifications,
    clearNotifications,
    unreadNotifications: notificationState.unreadNotifications,
    hasNewNotifications: notificationState.unreadNotifications > 0
  };
};
