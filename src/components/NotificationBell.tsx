import React, { useEffect, useState, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markAllRead,
  markRead,
  AppNotification,
} from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const unread = items.filter((n) => !n.is_read).length;

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const list = await fetchNotifications(user.id, 20);
      setItems(list);
    } catch (e) {
      console.error("Notification fetch failed", e);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refresh();

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  const handleItem = async (n: AppNotification) => {
    if (!n.is_read) await markRead(n.id);
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    if (!user) return;
    await markAllRead(user.id);
    refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          <div className="flex gap-1">
            {unread > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAll}
                className="h-7 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" /> Mark all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/notifications")}
              className="h-7 text-xs"
            >
              View all
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItem(n)}
                  className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors ${
                    !n.is_read ? "bg-accent/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{n.title}</div>
                      {n.body && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {n.body}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
