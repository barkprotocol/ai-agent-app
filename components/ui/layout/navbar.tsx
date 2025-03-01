"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/ui/wallet-button"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Cpu, Cog, MessageCircle } from "lucide-react"
import { Logo } from "@/components/ui/layout/logo"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/pages/agents", icon: Cpu, label: "AI Agents" },
  { href: "/dashboard", icon: Cog, label: "Dashboard" },
  { href: "/message", icon: MessageCircle, label: "Messages", external: true },
]

export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <header
      className={`w-full py-4 px-6 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-sm" : "bg-black"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex flex-grow justify-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#DBCFC7]/80 hover:text-[#DBCFC7] flex items-center space-x-2 transition-colors duration-200"
              onClick={closeMenu}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              <item.icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden text-[#DBCFC7] focus:outline-none focus:ring-2 focus:ring-[#DBCFC7] rounded-md p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 5.586l2.293-2.293a1 1 0 0 1 1.414 1.414L9.414 7l2.293 2.293a1 1 0 1 1-1.414 1.414L8 8.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 7 4.293 4.707a1 1 0 0 1 0-1.414z" />
            ) : (
              <path d="M2 3h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2z" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center space-x-4">
          <WalletButton />
          <Button
            asChild
            className="text-white bg-black border border-white hover:bg-gray-950 hover:text-white transition-colors duration-200"
          >
            <Link href="/home">Login</Link>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/90 text-white p-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block flex items-center space-x-2 py-2 transition-colors duration-200 hover:text-white"
                onClick={closeMenu}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                <item.icon size={20} aria-hidden="true" /> <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4">
              <WalletButton />
            </div>
            <Button
              asChild
              className="w-full text-white bg-black border border-white hover:bg-gray-900 hover:text-gray-100 transition-colors duration-200"
            >
              <Link href="/home" onClick={closeMenu}>
                Login
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

