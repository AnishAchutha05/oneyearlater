"use client"

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"

const PAGE_LABELS: Record<string, { label: string; color: string }> = {
  "/": { label: "HOME", color: "#f43f5e" },
  "/memories": { label: "BESTGIRL PICS", color: "#ec4899" },
  "/love-letter": { label: "LOVE LETTER", color: "#d946ef" },
  "/mini-game": { label: "OUR GAME", color: "#8b5cf6" },
}

export function PageCursor() {
  const pathname = usePathname()
  const page = PAGE_LABELS[pathname]

  return (
    <AnimatePresence mode="wait">
      {page && (
        <motion.div
          key={pathname}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-[9999] px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-xl"
          style={{ background: `linear-gradient(90deg, ${page.color}, ${page.color}bb)` }}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {page.label}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

