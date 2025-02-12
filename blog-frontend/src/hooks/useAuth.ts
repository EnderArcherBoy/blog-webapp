"use client"

import { useEffect, useState } from 'react'

export type UserRole = 'admin' | 'writer' | 'user' | null

interface User {
  role: UserRole
  isAuthenticated: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User>({
    role: null,
    isAuthenticated: false
  })

  useEffect(() => {
    // Here you would typically fetch the user's role from your authentication service
    // For now, we'll simulate it with localStorage
    const checkAuth = () => {
      const role = localStorage.getItem('userRole') as UserRole
      const isAuthenticated = !!localStorage.getItem('isAuthenticated')
      
      setUser({
        role,
        isAuthenticated
      })
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const hasRequiredRole = (requiredRoles: UserRole[]) => {
    return user.isAuthenticated && user.role && requiredRoles.includes(user.role)
  }

  return {
    user,
    hasRequiredRole,
    isAuthenticated: user.isAuthenticated
  }
}
