import type { AuthResponse, ProfileData } from '../types/auth';

const API_BASE = (import.meta as any).env?.VITE_AI_API_BASE_URL || 'http://localhost:8000';
const DEMO_AUTH = (import.meta as any).env?.VITE_DEMO_AUTH === 'true';

const normalizeBase = (base: string) => base.replace(/\/$/, '');

const buildUrl = (path: string) => {
  const base = normalizeBase(API_BASE);
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const DEMO_TOKEN = 'demo-token';
const DEMO_PROFILE_KEY = 'demoProfile';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isDemoToken(token: string | null) {
  return token === DEMO_TOKEN;
}

export function getDemoProfile(): ProfileData {
  const raw = localStorage.getItem(DEMO_PROFILE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as ProfileData;
    } catch {
      localStorage.removeItem(DEMO_PROFILE_KEY);
    }
  }
  return {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@dentalai.local',
    first_name: 'Demo',
    last_name: 'User',
    phone: '',
    license_number: '',
    specialty: 'General Dentistry',
    display_name: 'Demo User',
  };
}

export function setDemoProfile(partial: Partial<ProfileData>): ProfileData {
  const current = getDemoProfile();
  const merged: ProfileData = {
    ...current,
    ...partial,
  };
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(merged));
  return merged;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (DEMO_AUTH) {
    setAccessToken(DEMO_TOKEN);
    setDemoProfile({
      id: 'demo-user',
      name: email.split('@')[0] || 'Demo User',
      email,
      display_name: email.split('@')[0] || 'Demo User',
    });
    return { access_token: DEMO_TOKEN, token_type: 'bearer' };
  }
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.detail || 'Invalid credentials');
  }
  const data: AuthResponse = await response.json();
  setAccessToken(data.access_token);
  return data;
}

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  if (DEMO_AUTH) {
    setAccessToken(DEMO_TOKEN);
    setDemoProfile({
      id: 'demo-user',
      name,
      email,
      display_name: name || email.split('@')[0] || 'Demo User',
    });
    return { access_token: DEMO_TOKEN, token_type: 'bearer' };
  }
  const response = await fetch(buildUrl('/auth/signup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.detail || 'Unable to sign up');
  }
  const data: AuthResponse = await response.json();
  setAccessToken(data.access_token);
  return data;
}
