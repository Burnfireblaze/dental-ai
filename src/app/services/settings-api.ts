import type { ChangePasswordPayload, ProfileData, ProfileUpdate } from '../types/auth';
import { getAccessToken, getDemoProfile, isDemoToken, setDemoProfile } from './auth-api';

const API_BASE = (import.meta as any).env?.VITE_AI_API_BASE_URL || 'http://localhost:8000';

const normalizeBase = (base: string) => base.replace(/\/$/, '');

const buildUrl = (path: string) => {
  const base = normalizeBase(API_BASE);
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

const authHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return { Authorization: `Bearer ${token}` };
};

export async function getProfile(): Promise<ProfileData> {
  const token = getAccessToken();
  if (isDemoToken(token)) {
    return getDemoProfile();
  }
  const response = await fetch(buildUrl('/settings/profile'), {
    headers: {
      ...authHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Unable to load profile');
  }
  return response.json();
}

export async function updateProfile(payload: ProfileUpdate): Promise<ProfileData> {
  const token = getAccessToken();
  if (isDemoToken(token)) {
    return setDemoProfile({
      ...payload,
      name: payload.name ?? undefined,
      email: payload.email ?? undefined,
      first_name: payload.first_name ?? undefined,
      last_name: payload.last_name ?? undefined,
      phone: payload.phone ?? undefined,
      license_number: payload.license_number ?? undefined,
      specialty: payload.specialty ?? undefined,
      display_name: payload.display_name ?? undefined,
    });
  }
  const response = await fetch(buildUrl('/settings/profile'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.detail || 'Unable to update profile');
  }
  return response.json();
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  const token = getAccessToken();
  if (isDemoToken(token)) {
    return;
  }
  const response = await fetch(buildUrl('/settings/change-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.detail || 'Unable to change password');
  }
}
