"use client";

import { UserButton } from "@/components/auth/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on auth pages
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <div className="fixed top-0 w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b bg-background">
      <div className="flex items-center gap-x-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Logo/Home Link */}
        <Link href="/">
          <div className="flex items-center gap-x-2">
            <Home className="h-5 w-5" />
            <span className={cn(
              "font-semibold text-lg hidden md:block",
              pathname === "/" && "text-blue-500"
            )}>
              KC Store Fixtures
            </span>
          </div>
        </Link>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
} 