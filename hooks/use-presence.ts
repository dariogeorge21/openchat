'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { RealtimeChannel } from '@supabase/supabase-js';
import { formatLastActive } from '@/lib/utils';

export interface PresenceInfo {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
}

export function usePresence() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceInfo>>({});
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('openchat:presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{
          user_id: string;
          online_at: string;
        }>();

        const newMap: Record<string, PresenceInfo> = {};
        for (const [key, presences] of Object.entries(state)) {
          if (presences && presences.length > 0) {
            newMap[key] = {
              userId: key,
              isOnline: true,
              lastSeen: presences[0].online_at || new Date().toISOString(),
            };
          }
        }
        setPresenceMap((prev) => ({ ...prev, ...newMap }));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (newPresences && newPresences.length > 0) {
          const pres = newPresences[0] as { online_at?: string };
          setPresenceMap((prev) => ({
            ...prev,
            [key]: {
              userId: key,
              isOnline: true,
              lastSeen: pres.online_at || new Date().toISOString(),
            },
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        const leaveTime = new Date().toISOString();
        setPresenceMap((prev) => ({
          ...prev,
          [key]: {
            userId: key,
            isOnline: false,
            lastSeen: leaveTime,
          },
        }));

        // Update database last_seen for user if leaving is self
        if (key === user.id) {
          supabase
            .from('profiles')
            .update({ is_online: false, last_seen: leaveTime })
            .eq('id', user.id)
            .then(() => {});
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const now = new Date().toISOString();
          await channel.track({
            user_id: user.id,
            online_at: now,
          });

          // Also update database profile
          await supabase
            .from('profiles')
            .update({ is_online: true, last_seen: now })
            .eq('id', user.id);
        }
      });

    // Handle browser unload / tab close
    const handleBeforeUnload = () => {
      if (channelRef.current) {
        channelRef.current.untrack();
      }
      navigator.sendBeacon?.(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`,
        JSON.stringify({ is_online: false, last_seen: new Date().toISOString() })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, supabase]);

  // Periodic ticker to refresh relative "last seen" timestamps automatically
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1_000_000);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const getPresence = useCallback(
    (
      userId: string | undefined,
      fallbackLastSeen?: string | null
    ): { isOnline: boolean; statusText: string } => {
      if (!userId) return { isOnline: false, statusText: 'Offline' };
      const info = presenceMap[userId];

      if (info?.isOnline) {
        return { isOnline: true, statusText: 'Online' };
      }

      const lastSeenTime = info?.lastSeen || fallbackLastSeen;
      if (!lastSeenTime) {
        return { isOnline: false, statusText: 'Offline' };
      }

      return {
        isOnline: false,
        statusText: formatLastActive(lastSeenTime),
      };
    },
    [presenceMap, tick]
  );

  return { presenceMap, getPresence };
}
