const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4107/api';

function authHeaders() {
  const token = localStorage.getItem('moto_social_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Erro inesperado' }));
    throw new Error(payload.error || 'Erro inesperado');
  }

  return response.json();
}

export { API_BASE };
