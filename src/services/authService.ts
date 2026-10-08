import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { AuthCredentials, AuthUser } from '../types/auth';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthSessionResult {
  user: AuthUser | null;
  session: Session | null;
}

/**
 * Maps Supabase User to Career Saathi AuthUser
 */
export function mapSupabaseUserToAuthUser(user: User): AuthUser {
  const meta = user.user_metadata || {};
  const name = (meta.full_name as string) || (user.email ? user.email.split('@')[0] : 'Student');
  return {
    id: user.id,
    email: user.email || '',
    name,
    role: (meta.role as 'student' | 'job_seeker') || 'student',
    authProvider: 'supabase',
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
  };
}

export const authService = {
  /**
   * Check if Supabase authentication is available
   */
  isAvailable(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Get the current active session
   */
  async getSession(): Promise<AuthSessionResult> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      return { user: null, session: null };
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      return { user: null, session: null };
    }

    return {
      user: mapSupabaseUserToAuthUser(session.user),
      session,
    };
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase Auth is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but user identity was not returned.');
    }

    return mapSupabaseUserToAuthUser(data.user);
  },

  /**
   * Register a new student account
   */
  async signUp(creds: AuthCredentials): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase Auth is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: creds.email.trim(),
      password: creds.password,
      options: {
        data: {
          full_name: creds.fullName || '',
          college: creds.college || '',
          branch: creds.branch || '',
          role: creds.role || 'student',
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Registration failed to create user identity.');
    }

    return mapSupabaseUserToAuthUser(data.user);
  },

  /**
   * Sign out current user session
   */
  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Request password reset email
   */
  async resetPasswordForEmail(email: string, redirectTo?: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase Auth is not configured.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectTo || window.location.origin,
    });

    if (error) {
      throw error;
    }
  },

  /**
   * Update password for an active session (e.g. from password reset link)
   */
  async updatePassword(newPassword: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase Auth is not configured.');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  },

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null, authUser: AuthUser | null) => void
  ) {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const authUser = session?.user ? mapSupabaseUserToAuthUser(session.user) : null;
      callback(event, session, authUser);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
