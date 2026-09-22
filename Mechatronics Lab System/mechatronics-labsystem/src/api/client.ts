export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as ApiErrorPayload;

   if (payload.errors) {
    const validationMessages = Object.values(payload.errors)
    .flat()
    .filter(Boolean);

   if (validationMessages.length > 0) {
    message = validationMessages.join(' ');
   } else {
    message = payload.message || payload.error || message;
  }
} else {
  message = payload.message || payload.error || message;
}
    } catch {
      // Keep the HTTP fallback when the server does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  getCurrentUser: () => request<{ user: import('../contexts/AuthContext').User } | import('../contexts/AuthContext').User>('/auth/me'),
  login: (payload: { email: string; password: string; role?: import('../contexts/AuthContext').UserRole }) =>
    request<{ user: import('../contexts/AuthContext').User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    register: (payload: import('../contexts/AuthContext').RegisterPayload) =>
    request<{ user?: import('../contexts/AuthContext').User; message?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: { email: string }) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { token: string; password: string }) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
};


