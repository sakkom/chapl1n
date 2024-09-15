'use client'

import { Globe, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2" style={{ borderWidth: '500px' }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/explore" passHref>
          <Button variant="ghost" size="lg" className="p-2" asChild>
            <a aria-label="Explore">
              <Globe color="pink" size={40} />
            </a>
          </Button>
        </Link>
        <Link href="/profile" passHref>
          <Button variant="ghost" size="lg" className="p-2" asChild>
            <a aria-label="User Profile">
              <UserCircle color="pink" size={40} />
            </a>
          </Button>
        </Link>
      </div>
    </div>
  )
}