export const API_ROUTES = {
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

export const getApiUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const apiRequest = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem('token') || '';
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  const response = await fetch(url, defaultOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};