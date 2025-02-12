import { getToken, setToken, removeToken } from './auth';
import { Article } from '@/types/article';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: File;
}

export const api = {
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
      mode: 'cors'
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  },

  auth: {
    async login(email: string, password: string) {
      const response = await api.fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.token) {
        setToken(response.token);
      }
      return response.json();
    },

    async logout() {
      await api.fetchWithAuth('/auth/logout', {
        method: 'POST',
      });
      removeToken();
    },
  },

  // Articles endpoints
  getArticles: async () => {
    const response = await fetch(`${API_URL}/articles`);
    return response.json();
  },

  createArticle: async (article: Article, token: string) => {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData); // Debug log
      throw new Error(errorData.message || 'Failed to create article');
    }
    return response.json();
  },

  getArticle: async (id: string): Promise<Article> => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/articles/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching article:', errorData);
      throw new Error(errorData.error || 'Failed to fetch article');
    }

    return response.json();
  },

  updateArticle: async (id: string, formData: FormData): Promise<Article> => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/articles/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating article:', errorData);
      throw new Error(errorData.error || 'Failed to update article');
    }

    return response.json();
  },

  deleteArticle: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
};

export async function createArticle(data: CreateArticleData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create article');
    }

    return await response.json();
  } catch (error) {
    console.error('Create article error:', error);
    throw error;
  }
};

export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('Raw API response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (!data.token || !data.user || !data.user.role) {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};