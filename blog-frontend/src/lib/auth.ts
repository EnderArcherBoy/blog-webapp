import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const setToken = (token: string) => {
  try {
    // Store token
    localStorage.setItem('token', token);
    Cookies.set('token', token, { path: '/' });
    
    // Decode the token to get user info
    const decoded = jwtDecode<DecodedToken>(token);
    console.log('Decoded token:', decoded); // Debug log
    
    // Store user info from token
    localStorage.setItem('userRole', decoded.role);
    localStorage.setItem('userId', decoded.id);
    Cookies.set('userRole', decoded.role, { path: '/' });
    Cookies.set('userId', decoded.id, { path: '/' });
    
    return true;
  } catch (error) {
    console.error('Error setting token:', error);
    return false;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    // First try to get from localStorage
    const storedId = localStorage.getItem('userId');
    if (storedId) return storedId;

    // If not in localStorage, try to get from token
    const token = getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Store it for next time
      localStorage.setItem('userId', decoded.id);
      return decoded.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      // Clear cookies
      Cookies.remove('token', { path: '/' });
      Cookies.remove('userRole', { path: '/' });
      Cookies.remove('userId', { path: '/' });
      
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentUserId = () => {
  return getUserId();
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Set the token which will also store role and userId
    setToken(data.token);

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};