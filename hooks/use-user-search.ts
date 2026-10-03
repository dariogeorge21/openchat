'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { Profile } from '@/types/database';

export function useUserSearch() {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      if (!user) return;

      const trimmed = searchTerm.trim();
      if (!trimmed) {
        // Load recent or recommended users
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, display_name, username, avatar_url, about, last_seen, is_online, created_at, updated_at')
            .neq('id', user.id)
            .order('last_seen', { ascending: false })
            .limit(15);

          if (!error && data) {
            setResults(data as Profile[]);
          }
        } catch (err) {
          console.error('Error fetching initial users:', err);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, display_name, username, avatar_url, about, last_seen, is_online, created_at, updated_at')
          .neq('id', user.id)
          .or(`display_name.ilike.%${trimmed}%,username.ilike.%${trimmed}%`)
          .limit(20);

        if (!error && data) {
          setResults(data as Profile[]);
        }
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setLoading(false);
      }
    },
    [user, supabase]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchUsers(query);
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, searchUsers]);

  return {
    query,
    setQuery,
    results,
    loading,
    searchUsers,
  };
}
