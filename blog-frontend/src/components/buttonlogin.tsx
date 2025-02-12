"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

export default function ButtonLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      setUsername("User");
    }
  }, []);

  const handleLogout = () => {
    // Clear auth data
    removeToken();
    setIsLoggedIn(false);
    
    // Force a complete page reload to clear any cached state
    window.location.href = '/';
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {username}!</span>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => router.push("/login")}>
        Sign In
      </Button>
      <Button onClick={() => router.push("/register")}>
        Sign Up
      </Button>
    </div>
  );
}
