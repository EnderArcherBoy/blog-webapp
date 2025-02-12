"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUserRole } from "@/lib/auth";
import { apiRequest, API_ROUTES, getApiUrl } from '@/lib/api-utils';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/protected-route';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const role = getUserRole();
    const token = getToken();
    if (token) {
      try {
        const decoded = jwt.decode(token) as { id: string } | null;
        if (decoded) {
          setCurrentUserId(decoded.id);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setCurrentUserRole(role);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request to:', `${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log('Users data:', data);

      if (!data.users) {
        throw new Error('No users data in response');
      }

      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Prevent self-demotion for admin
      if (userId === currentUserId && currentUserRole === 'admin' && newRole !== 'admin') {
        toast.error("Admins cannot demote themselves");
        return;
      }

      const token = getToken();
      // Using PATCH method for partial updates
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`;
      console.log('Updating role - Request URL:', url);
      console.log('Request body:', { role: newRole });

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (!response.ok) {
        const errorMessage = responseData ? JSON.parse(responseData).message : 'Failed to update user role';
        throw new Error(errorMessage);
      }

      toast.success('User role updated successfully');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userRole: string) => {
    try {
      // Prevent deleting self
      if (userId === currentUserId) {
        toast.error("You cannot delete your own account");
        return;
      }

      // Prevent deleting other admins if not an admin
      if (userRole === 'admin' && currentUserRole !== 'admin') {
        toast.error("Only admins can delete admin accounts");
        return;
      }

      const confirmed = window.confirm('Are you sure you want to delete this user?');
      if (!confirmed) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const content = (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          <Link href="/dashboard">Dashboard</Link>
        </h2>
        <nav>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-gray-300">
              <Link href="/dashboard/manage-users">Manage Users</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link href="/dashboard/manage-articles">Manage Articles</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <Link href="/dashboard">Go Back</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 border-b text-left">Username</th>
                  <th className="px-6 py-3 border-b text-left">Email</th>
                  <th className="px-6 py-3 border-b text-left">Role</th>
                  <th className="px-6 py-3 border-b text-left">Created At</th>
                  <th className="px-6 py-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{user.username}</td>
                    <td className="px-6 py-4 border-b">{user.email}</td>
                    <td className="px-6 py-4 border-b">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUserId}
                        className="w-32 p-2 border rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="writer">Writer</option>
                        <option value="reader">Reader</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeleteUser(user.id, user.role)}
                        disabled={
                          user.id === currentUserId || // Can't delete self
                          (user.role === 'admin' && currentUserRole !== 'admin') // Non-admins can't delete admins
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {content}
    </ProtectedRoute>
  );
}
