"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getUserRole, isAuthenticated } from "@/lib/auth"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [userRole, setUserRole] = React.useState<string | null>(null)
  const [isAuth, setIsAuth] = React.useState(false)

  React.useEffect(() => {
    setUserRole(getUserRole())
    setIsAuth(isAuthenticated())
  }, [])

  const showDashboard = isAuth && (userRole === 'admin' || userRole === 'writer')

  return (
    <nav className="w-full border-b bg-white/75 backdrop-blur-md fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Novatus Global</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-6">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:text-primary transition-colors">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/articles" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:text-primary transition-colors">
                      Articles
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about-page" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:text-primary transition-colors">
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/team-page" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:text-primary transition-colors">
                      Our Team
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {showDashboard && (
              <Link href="/dashboard">
                <Button 
                  variant="outline"
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/articles/create">
              <Button 
                variant="outline" 
                size="sm"
              >
                Create Article
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/about-page"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/team-page"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Team
              </Link>
              {showDashboard && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/articles/create"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Article
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
