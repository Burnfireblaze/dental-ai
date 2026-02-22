export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  license_number?: string | null;
  specialty?: string | null;
  display_name?: string | null;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  license_number?: string | null;
  specialty?: string | null;
  display_name?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
