"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      console.log('Checking auth - Token:', !!token, 'Role:', userRole); // Debug log
      
      if (!token) {
        console.log('No token found, redirecting to login'); // Debug log
        router.push('/login');
        return;
      }

      if (!userRole || !allowedRoles.includes(userRole)) {
        console.log('Unauthorized role, redirecting to home'); // Debug log
        toast.error('You do not have permission to access this page');
        router.push('/');
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}