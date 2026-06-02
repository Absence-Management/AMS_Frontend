import { useState, useEffect, useRef, useCallback } from "react";
import { notificationService } from "@/services/notificationService";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/shared/ToastProvider";

export const useNotifications = () => {
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [data, count] = await Promise.all([
        notificationService.getNotifications({ page: 1, page_size: 20 }),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(data.data || []);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectWebSocket = useCallback(async () => {
    try {
      // Get the token + backend WS base URL from our Next.js API route.
      // NOTE: Next.js rewrites() do NOT proxy WebSocket connections, so we must
      // connect directly to the FastAPI backend, not through window.location.host.
      const res = await fetch("/api/auth/token");
      if (!res.ok) return;
      const { token, wsBaseUrl } = await res.json();
      if (!token || !wsBaseUrl) return;

      const wsUrl = `${wsBaseUrl}/api/v1/ws/notifications?token=${token}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to notification websocket");
      };

      ws.onmessage = (event) => {
        try {
          const newNotification = JSON.parse(event.data);

          // Deduplicate: skip if this notification is already in the list
          // (can happen when the REST fetch and the WS push race each other)
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) return prev;

            // Genuinely new — also bump the badge and show a toast
            setUnreadCount((c) => c + 1);
            showToast({
              title: newNotification.title,
              description: newNotification.body,
              type: "info",
              duration: 5000,
            });

            return [newNotification, ...prev];
          });
        } catch (e) {
          console.error("Failed to parse websocket message:", e);
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from notification websocket. Reconnecting in 5s...");
        setTimeout(connectWebSocket, 5000);
      };

    } catch (e) {
      console.error("WebSocket connection error:", e);
      setTimeout(connectWebSocket, 5000);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, fetchInitialData, connectWebSocket]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchMore: async (page) => {
      try {
        const data = await notificationService.getNotifications({ page, page_size: 20 });
        setNotifications((prev) => [...prev, ...(data.data || [])]);
      } catch (error) {
        console.error("Failed to fetch more notifications:", error);
      }
    }
  };
};
