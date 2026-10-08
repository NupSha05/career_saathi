// Authentication and Session Types
export type AuthStatus = 'unauthenticated' | 'authenticated' | 'authenticating';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'job_seeker';
  authProvider: 'local' | 'google' | 'guest';
  createdAt: string;
}

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  mode: 'production' | 'demo';
  sessionToken?: string;
}
