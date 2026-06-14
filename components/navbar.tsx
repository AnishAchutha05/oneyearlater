"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Heart, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ComicText } from "@/components/ui/comic-text"


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/memories", label: "bestgirl pics" },
  { href: "/love-letter", label: "Love Letter" },
  { href: "/mini-game", label: "Our Game" },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-4 left-4 right-4 md:left-12 md:right-12 z-50 flex items-center justify-between px-6 py-1.5 transition-all duration-500 rounded-full bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Heart
              className="w-7 h-7 text-primary fill-primary animate-heartbeat"
              strokeWidth={1.5}
            />
            <span className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-heartbeat" />
          </motion.div>
          <span
            className="text-xl font-bold gradient-text"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            365 Days of Us
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className={cn(
                      "relative px-2 py-1 text-sm font-medium transition-colors duration-300 flex items-center justify-center",
                      active
                        ? "text-primary-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary"
                        style={{
                          borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
                          transform: "rotate(-2deg)"
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={cn("relative z-10 flex items-center justify-center", active ? "text-white" : "text-black")}>
                      <ComicText fontSize={0.8} className={active ? "!text-white" : "!text-black hover:!text-primary transition-colors"}>
                        {link.label}
                      </ComicText>
                    </span>
                  </motion.span>
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full overflow-hidden border-[2.5px] border-[#160029] shadow-[3px_3px_0px_0px_#160029] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#160029] transition-all">
              <Image 
                src="/Screenshot_20260518_231937.jpg" 
                alt="Her Avatar" 
                width={40} 
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl bg-white border-2 border-[#160029] shadow-[2px_2px_0px_0px_#160029] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#160029] transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[88px] left-4 right-4 z-50 bg-white border-[3px] border-[#160029] shadow-[6px_6px_0px_0px_#160029] rounded-3xl p-6 flex flex-col gap-2"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-primary text-white border-2 border-[#160029] shadow-[2px_2px_0px_0px_#160029]"
                      : "hover:bg-primary/10 text-black border-2 border-transparent"
                  )}
                >
                  <ComicText fontSize={1} className={pathname === link.href ? "!text-white" : "!text-black"}>
                    {link.label}
                  </ComicText>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
