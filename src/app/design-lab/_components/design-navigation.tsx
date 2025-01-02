import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/auth/user-button"
import Image from "next/image"

export function DesignNavigation() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>

        {/* Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/design-lab">
            <Image
              src="/logos/BlackLogo-Text.png"
              alt="Takeout Threads Logo"
              width={150}
              height={40}
              className="dark:invert"
            />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}
