const API_BASE_URL = '/api/v1';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  total?: number;
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('coturnos_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

export default request;
