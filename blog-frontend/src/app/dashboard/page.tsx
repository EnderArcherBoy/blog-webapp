"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';
import ProtectedRoute from '@/components/protected-route';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    console.log('Dashboard - Current Role:', role);
    setUserRole(role);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'writer']}>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <nav>
            <ul className="space-y-4">
              <li className="text-sm text-gray-400">
                Current Role: {userRole}
              </li>
              
              {userRole === 'admin' && (
                <li className="cursor-pointer hover:text-gray-300">
                  <a href="/dashboard/manage-users">Manage Users</a>
                </li>
              )}
              
              <li className="cursor-pointer hover:text-gray-300">
                <a href="/dashboard/manage-articles">Manage Articles</a>
              </li>
              
              <li className="cursor-pointer hover:text-gray-300">
                <a href="/">Go Back</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to Dashboard
            </h1>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}