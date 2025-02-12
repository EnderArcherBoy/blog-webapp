"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function DashboardButton() {
  const { hasRequiredRole, user } = useAuth()
  
  // Add console log for debugging
  console.log('Current user role:', user.role)
  console.log('Is authenticated:', user.isAuthenticated)
  
  // Only show the button for admin and writer roles
  if (!hasRequiredRole(['admin', 'writer'])) {
    return null
  }

  return (
    <Link href="/dashboard">
      <Button 
        variant="default"
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Dashboard
      </Button>
    </Link>
  )
}
