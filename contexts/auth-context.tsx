'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { StoredKeyPair } from '@/types/crypto';
import { initializeUserKeys, clearKeyCaches } from '@/lib/crypto/e2ee';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  keyPair: StoredKeyPair | null;
  loading: boolean;
  isCryptoReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [keyPair, setKeyPair] = useState<StoredKeyPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCryptoReady, setIsCryptoReady] = useState(false);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  }, [supabase]);

  const initUserSession = useCallback(async (currentUser: User) => {
    try {
      // 1. Fetch or wait for profile created by trigger
      let userProfile = await fetchProfile(currentUser.id);
      if (!userProfile) {
        // If trigger has a slight delay or user profile doesn't exist yet, insert a basic fallback
        const displayName = currentUser.user_metadata?.full_name || 
                            currentUser.user_metadata?.name || 
                            currentUser.email?.split('@')[0] || 
                            'User';
        const avatarUrl = currentUser.user_metadata?.avatar_url || 
                          currentUser.user_metadata?.picture || 
                          null;

        const { data: insertedProfile } = await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            email: currentUser.email,
            display_name: displayName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .select()
          .maybeSingle();

        userProfile = insertedProfile as Profile;
      }
      setProfile(userProfile);

      // 2. Initialize device E2EE Cryptographic Engine (IndexedDB + Public Key publish)
      const cryptoKeys = await initializeUserKeys(currentUser.id, supabase);
      setKeyPair(cryptoKeys);
      setIsCryptoReady(true);
    } catch (err) {
      console.error('Failed to initialize session crypto:', err);
    }
  }, [fetchProfile, supabase]);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          await initUserSession(session.user);
        }
      } catch (err) {
        console.warn('Session check warning:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await initUserSession(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setKeyPair(null);
        setIsCryptoReady(false);
        clearKeyCaches();
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, initUserSession]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
  }, [user, fetchProfile]);

  const signInWithGoogle = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectUrl = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    clearKeyCaches();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setKeyPair(null);
    setIsCryptoReady(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        keyPair,
        loading,
        isCryptoReady,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
