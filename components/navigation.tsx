"use client"

import { cn } from "@/lib/utils"
import { photoGalleryOpenAtom } from "@/lib/atoms/ui"
import { useAtomValue } from "jotai"
import { motion } from "framer-motion"
import { Database, Search } from "lucide-react"
import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "Search", icon: Search },
  { href: "/database", label: "Database", icon: Database },
]

export function Navigation() {
  const pathname = usePathname()
  const isGalleryOpen = useAtomValue(photoGalleryOpenAtom)

  if (isGalleryOpen) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="container mx-auto flex h-16 items-center pointer-events-auto">
        <div className="flex items-center justify-center gap-1 w-full">
          <div className="flex items-center justify-center gap-1 w-fit p-1 rounded-2xl bg-[#DBDAD8]/90">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-accent rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                  <Icon className="size-4 relative z-10 " />
                  <span className="relative z-10">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

