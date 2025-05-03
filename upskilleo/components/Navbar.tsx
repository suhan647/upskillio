'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { UserCircle, LogIn, BookOpen } from 'lucide-react';
import { toast } from "sonner";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('upskilleo-theme', 'dark');

    // Check login status from query or localStorage
    const loginParam = searchParams.get('login');

    if (loginParam === 'true') {
      localStorage.setItem('upskilleo-user', 'user1');
      setIsLoggedIn(true);
    } else if (loginParam === 'false') {
      localStorage.removeItem('upskilleo-user');
      setIsLoggedIn(false);
    } else {
      const userLoggedIn = localStorage.getItem('upskilleo-user');
      setIsLoggedIn(!!userLoggedIn);
    }
  }, [searchParams]);

  const handleLogin = () => {
    localStorage.setItem('upskilleo-user', 'user1');
    localStorage.setItem('purchased-courses', JSON.stringify(['javascript', 'html-css', 'react']));
    setIsLoggedIn(true);

    const purchasedCourses = JSON.parse(localStorage.getItem('purchased-courses') || '[]');
    const hasPurchasedCourses = purchasedCourses.length > 0;

    // Construct URL with login + course params
    const newUrl = `${pathname}?login=true&boughtCourse=${hasPurchasedCourses ? 'true' : 'false'}`;
    router.push(newUrl);

    toast.success("Logged in successfully", {
      description: "Welcome to Upskilleo!",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('upskilleo-user');
    localStorage.removeItem('purchased-courses');
    setIsLoggedIn(false);

    const newUrl = `${pathname}?login=false&boughtCourse=false`;
    router.push(newUrl);

    toast.success("Logged out successfully", {
      description: "See you next time!",
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-4 glass-morphism backdrop-blur-md bg-background/80 border-b border-border/40 mb-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-gradient">Upskilleo</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/learning?login=true&boughtCourse=true"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <BookOpen size={16} />
                Your Learning
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <UserCircle size={18} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogin} className="flex items-center gap-2">
                <LogIn size={18} />
                Login
              </Button>
              <Button variant="default" size="sm">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
