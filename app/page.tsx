"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { Navbar } from "@/components/navbar"
import { MorphingText } from "@/components/ui/morphing-text"
import { Meteors } from "@/components/ui/meteors"
import { TextAnimate } from "@/components/ui/text-animate"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { MagicCard } from "@/components/ui/magic-card"
import { HyperText } from "@/components/ui/hyper-text"
import Link from "next/link"
import { ArrowRight, Calendar, Heart } from "lucide-react"
import { Terminal, AnimatedSpan, TypingAnimation } from "@/components/ui/terminal"
import { ComicText } from "@/components/ui/comic-text"
import { ShineBorder } from "@/components/ui/shine-border"
import { Marquee } from "@/components/ui/marquee"

const collageCol1 = [
  "/Screenshot_20260518_231937.jpg",
  "/IMG_20260518_120035.jpg",
  "/IMG_20260521_134522.jpg",
]
const collageCol2 = [
  "/IMG_20260521_134525.jpg",
  "/IMG_20260521_134529.jpg",
  "/IMG_20260526_133416.jpg",
]

// Particle component — fixed to avoid window reference during SSR
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i * 2.3) % 7,
  x: (i * 17 + 5) % 100,
  delay: (i * 0.7) % 4,
  duration: 5 + (i * 0.9) % 6,
  color: ["#D44D5C", "#D6006B", "#E3B5A4", "#F5E9E2"][i % 4],
}))

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-60"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: 0,
            background: p.color,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

function CountdownDisplay() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    setMounted(true)
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted || !now) {
    return (
      <div className="flex flex-col items-center gap-4 text-center mt-6">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white border-[3px] border-black p-3 bg-red-400 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 w-full max-w-sm">
          Loading Time...
        </h3>
      </div>
    )
  }

  const startDate = new Date(2025, 5, 15, 0, 0, 0) // Month is 0-indexed (5 = June)
  
  let years = now.getFullYear() - startDate.getFullYear()
  let months = now.getMonth() - startDate.getMonth()
  let days = now.getDate() - startDate.getDate()

  // Adjust if time of day hasn't been reached yet
  if (
    now.getHours() < startDate.getHours() ||
    (now.getHours() === startDate.getHours() && now.getMinutes() < startDate.getMinutes()) ||
    (now.getHours() === startDate.getHours() && now.getMinutes() === startDate.getMinutes() && now.getSeconds() < startDate.getSeconds())
  ) {
    days -= 1
  }

  if (days < 0) {
    months -= 1
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += previousMonth.getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDiff = Math.max(0, now.getTime() - startDate.getTime())
  const hours = Math.floor((totalDiff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((totalDiff / 1000 / 60) % 60)
  const seconds = Math.floor((totalDiff / 1000) % 60)

  // Days left to next June 15
  const nextAnniversary = new Date(now.getFullYear(), 5, 15) // Month is 0-indexed, so 5 = June
  if (now.getTime() > nextAnniversary.getTime()) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }
  const daysLeft = Math.ceil((nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
      className="flex flex-col items-center gap-6 justify-center mt-4"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold tracking-widest text-primary/80 uppercase">Going Strong For</p>
        <div className="flex items-center gap-3 flex-wrap justify-center max-w-[300px] md:max-w-full">
          {[
            { value: years, label: "Years" },
            { value: months, label: "Months" },
            { value: days, label: "Days" },
            { value: hours, label: "Hours" },
            { value: minutes, label: "Mins" },
            { value: seconds, label: "Secs" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white border-2 border-[#160029] shadow-[3px_3px_0px_0px_#160029] rounded-xl px-4 py-2 text-center min-w-[70px]">
              <div
                className="text-2xl font-black text-[#160029] leading-none"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary border-2 border-[#160029] shadow-[4px_4px_0px_0px_#160029] rounded-full px-6 py-2">
        <p className="text-white font-bold text-sm">
          {daysLeft === 0 ? "It's our Anniversary! 🎉" : `${daysLeft} days left until June 15th! 💕`}
        </p>
      </div>
    </motion.div>
  )
}

const navCards = [
  {
    title: "bestgirl pics",
    subtitle: "Every photo of her, a proof of perfection.",
    href: "/memories",
    gradient: "from-rose-400 via-pink-400 to-fuchsia-400",
    bg: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
    accent: "#f43f5e",
    colSpan: 1,
    imgSrc: "/IMG_20260521_134529.jpg",
    tall: true,
  },
  {
    title: "Love Letter",
    subtitle: "Words from the heart, written just for you.",
    href: "/love-letter",
    gradient: "from-fuchsia-400 via-pink-400 to-rose-400",
    bg: "from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40",
    accent: "#d946ef",
    colSpan: 1,
    imgSrc: "/IMG_20260521_134525.jpg",
    tall: false,
  },
  {
    title: "Our Game",
    subtitle: "A tiny adventure made just for us.",
    href: "/mini-game",
    gradient: "from-red-400 via-rose-400 to-pink-400",
    bg: "from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40",
    accent: "#f43f5e",
    colSpan: 1,
    imgSrc: "/IMG_20260526_133416.jpg",
    tall: false,
  },
]

function FluidNavCard({ card, index }: { card: typeof navCards[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const colClass = card.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"

  return (
    <motion.div
      className={`${colClass} relative`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <Link href={card.href} className="block h-full">
        <div
          className={`relative overflow-hidden rounded-3xl h-full min-h-[200px] ${card.tall ? "min-h-[420px]" : ""} group cursor-pointer`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Base bg */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} transition-all duration-500`} />

          {/* Photo behind (memories card only) */}
          {card.imgSrc && (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.08 : 1.02 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={card.imgSrc} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </motion.div>
          )}

          {/* Fluid pink blob that expands on hover */}
          <motion.div
            className={`absolute -bottom-16 -right-16 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`}
            animate={{
              width: hovered ? 400 : 160,
              height: hovered ? 400 : 160,
              opacity: hovered ? 0.45 : 0.25,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className={`absolute -top-12 -left-12 rounded-full bg-gradient-to-br ${card.gradient} blur-3xl`}
            animate={{
              width: hovered ? 300 : 100,
              height: hovered ? 300 : 100,
              opacity: hovered ? 0.3 : 0.1,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ShineBorder on hover */}
          <AnimatePresence>
            {hovered && (
              <ShineBorder
                className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                shineColor={["#f43f5e", "#ec4899", "#d946ef", "#fb7185"]}
              />
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10 p-7 flex flex-col h-full justify-end">
            {/* Explore arrow top-right */}
            <motion.div
              className="absolute top-5 right-5"
              animate={{ x: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5" style={{ color: card.accent }} />
            </motion.div>

            {/* Bottom text */}
            <div className="mt-auto pt-6">
              <motion.h3
                className="text-xl md:text-2xl font-black text-foreground mb-2 leading-tight"
                animate={{ y: hovered ? -2 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {card.title}
              </motion.h3>
              <motion.p
                className="text-sm text-muted-foreground leading-relaxed"
                animate={{ opacity: hovered ? 1 : 0.7 }}
              >
                {card.subtitle}
              </motion.p>
              <motion.div
                className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Explore <ArrowRight className="w-3.5 h-3.5" style={{ color: card.accent }} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const reasonGradients = [
  { from: "#f43f5e", to: "#fb7185" },
  { from: "#ec4899", to: "#f472b6" },
  { from: "#d946ef", to: "#e879f9" },
  { from: "#f43f5e", to: "#fda4af" },
  { from: "#e11d48", to: "#fb7185" },
  { from: "#db2777", to: "#f9a8d4" },
]

// Cloud bump configs — 4 bumps per card, each slightly different
const cloudBumps = [
  [{ l: "8%", s: 54, t: -22 }, { l: "28%", s: 70, t: -34 }, { l: "52%", s: 58, t: -24 }, { r: "8%", s: 46, t: -16 }],
  [{ l: "6%", s: 50, t: -20 }, { l: "25%", s: 68, t: -32 }, { l: "50%", s: 64, t: -28 }, { r: "6%", s: 52, t: -18 }],
  [{ l: "10%", s: 58, t: -24 }, { l: "32%", s: 72, t: -36 }, { l: "55%", s: 56, t: -22 }, { r: "9%", s: 50, t: -16 }],
  [{ l: "7%", s: 52, t: -20 }, { l: "27%", s: 66, t: -30 }, { l: "48%", s: 60, t: -26 }, { r: "7%", s: 48, t: -18 }],
  [{ l: "9%", s: 56, t: -22 }, { l: "30%", s: 74, t: -36 }, { l: "54%", s: 62, t: -26 }, { r: "8%", s: 44, t: -14 }],
  [{ l: "6%", s: 48, t: -18 }, { l: "24%", s: 64, t: -30 }, { l: "49%", s: 58, t: -24 }, { r: "10%", s: 54, t: -20 }],
]

function CloudCard({ no, label, text, index }: { no: string; label: string; text: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const g = reasonGradients[index % reasonGradients.length]
  const bumps = cloudBumps[index % cloudBumps.length]
  const floatY = [14, 10, 16, 12, 14, 11][index % 6]
  const floatDur = [4.4, 5.2, 4.8, 5.6, 4.2, 5.9][index % 6]
  const floatDelay = [0, 0.9, 0.4, 1.3, 0.7, 0.2][index % 6]

  const bodyBg = `linear-gradient(145deg, ${g.from}20, ${g.to}10)`
  const bodyBorder = hovered ? `${g.from}60` : `${g.from}30`
  const bumpBg = hovered
    ? `linear-gradient(135deg, ${g.from}55, ${g.to}44)`
    : `linear-gradient(135deg, ${g.from}33, ${g.to}22)`

  return (
    <motion.div
      className="relative cursor-default select-none"
      animate={{ y: [0, -floatY, 0] }}
      transition={{ duration: floatDur, delay: floatDelay, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Inner: scroll entry animation */}
      <motion.div
        style={{ paddingTop: 40 }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.7, type: "spring", stiffness: 80 }}
      >
        {/* Drop shadow wraps bumps + body */}
        <div
          style={{
            filter: hovered
              ? `drop-shadow(0 16px 36px ${g.from}55)`
              : `drop-shadow(0 8px 20px ${g.from}28)`,
            transition: "filter 0.4s ease",
          }}
        >
          {/* Cloud bumps */}
          {bumps.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: b.s,
                height: b.s,
                top: b.t + 40,
                ...("l" in b ? { left: b.l } : { right: b.r }),
                background: bumpBg,
                backdropFilter: "blur(14px)",
                border: `1.5px solid ${bodyBorder}`,
                transition: "background 0.4s, border 0.4s",
              }}
            />
          ))}

          {/* Cloud body */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 40,
              background: bodyBg,
              border: `1.5px solid ${bodyBorder}`,
              backdropFilter: "blur(16px)",
              transition: "border 0.4s, background 0.4s",
              padding: "28px 28px 24px",
            }}
          >
            {/* Glow blob */}
            <motion.div
              className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${g.from}88, transparent)` }}
              animate={{ scale: hovered ? 2.2 : 1, opacity: hovered ? 0.45 : 0.15 }}
              transition={{ duration: 0.5 }}
            />

            {/* ShineBorder on hover */}
            <AnimatePresence>
              {hovered && (
                <ShineBorder
                  className="absolute inset-0 pointer-events-none z-10"
                  shineColor={[g.from, g.to, "#fecdd3"]}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <motion.span
                className="inline-block text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-full mb-3"
                style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})`, color: "#fff" }}
                animate={{ scale: hovered ? 1.08 : 1 }}
              >
                {no}
              </motion.span>

              <h3
                className="text-xl font-black text-foreground mb-2 leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {label}
              </h3>

              <p
                className="text-sm text-foreground/70 leading-relaxed italic"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {text}
              </p>

              <motion.div
                className="mt-4 h-[2px] rounded-full origin-left"
                style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }}
                animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <Meteors number={18} />
        <FloatingParticles />

        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-primary/10 animate-spin-slow" />
          <div className="absolute w-[450px] h-[450px] rounded-full border border-accent/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center gap-8 max-w-4xl"
        >
          {/* Date badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass px-5 py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <Calendar className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-muted-foreground font-medium tracking-wide">
              Since June 15, 2025
            </span>
          </motion.div>

          {/* Morphing headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, type: "spring", stiffness: 100 }}
            className="w-full"
          >
            <MorphingText
              texts={["365 Days of Us", "A Year of Love", "You & Me", "Forever Growing", "Our Anniversary"]}
              className="text-foreground/90 [&>span]:text-foreground"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="-mt-4 md:-mt-8 relative z-10"
          >
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
            >
              To the girl who changed everything — this is for you. Every day with you has been a gift I never knew I deserved.
            </TextAnimate>
          </motion.div>

          {/* Countdown */}
          <CountdownDisplay />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/love-letter">
              <InteractiveHoverButton className="bg-primary text-primary-foreground border-primary px-8 py-3 text-base rounded-full">
                Open Your Letter
              </InteractiveHoverButton>
            </Link>
            <Link href="/memories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-full glass text-foreground border border-border font-semibold text-base transition-all duration-300 hover:border-primary/40"
              >
                Our Memories
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* ── COMIC HIGHLIGHT 1 ── */}
      <section className="py-20 flex flex-col items-center justify-center overflow-hidden bg-primary/5 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="z-10 text-center px-4"
        >
          <ComicText fontSize={3.5} className="md:!text-[5rem] !text-[3rem] text-primary">YOU MATTER TO ME</ComicText>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* ── SCROLL MARQUEE ── */}
      <section className="py-8 border-y border-border/50 overflow-hidden relative">
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={2} className="py-3">
            {["when far away , RUN BACK TO ME", "YOU MATTER TO ME", "when far away , RUN BACK TO ME"].map((word, i) => (
              <span
                key={i}
                className="mx-8 text-3xl font-bold tracking-widest text-primary/80 select-none drop-shadow-sm"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {word}
              </span>
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={-2} direction={-1} className="py-3">
            {["YOU MATTER TO ME", "when far away , RUN BACK TO ME", "YOU MATTER TO ME"].map((word, i) => (
              <span
                key={i}
                className="mx-8 text-2xl font-bold uppercase tracking-widest text-muted-foreground/60 select-none"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {word}
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* ── HIGHLIGHT PHOTO ── */}
      <section className="py-24 px-6 md:px-16 flex flex-col md:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 flex justify-center w-full"
        >
          <div className="comic-panel relative flex h-[500px] w-full max-w-[400px] md:max-w-md flex-row items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-background/50 rotate-[-4deg]">
            <Marquee pauseOnHover vertical className="[--duration:25s]">
              {collageCol1.map((img, i) => (
                <div key={i} className="mb-4">
                  <img
                    src={img}
                    alt="Memory"
                    className="comic-panel rounded-2xl w-40 object-cover object-center h-48 md:w-56 md:h-64"
                  />
                </div>
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
              {collageCol2.map((img, i) => (
                <div key={i} className="mb-4">
                  <img
                    src={img}
                    alt="Memory"
                    className="comic-panel rounded-2xl w-40 object-cover object-center h-48 md:w-56 md:h-64"
                  />
                </div>
              ))}
            </Marquee>
            
            {/* Fade overlays for the collage */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background/90 to-transparent z-10 rounded-t-[2.5rem]"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/90 to-transparent z-10 rounded-b-[2.5rem]"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          className="flex-1 max-w-lg"
        >
          <HyperText
            className="text-4xl md:text-5xl font-bold gradient-text leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
            startOnView
            animateOnHover
          >
            MY FAVOURITE PERSON
          </HyperText>
          <p
            className="text-muted-foreground text-lg leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
          >
            You walked into my life and turned everything upside down — in the most perfect way. 
            I fall a little more for you every single day.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Kind", "Funny", "Beautiful", "My Person", "Adventurous"].map((tag) => (
              <span
                key={tag}
                className="glass px-4 py-2 rounded-full text-sm font-medium text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FLUID NAV CARDS ── */}
      <section className="py-24 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Explore Our World
          </h2>
          <p className="text-muted-foreground text-lg italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Everything that makes us, us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {navCards.map((card, i) => (
            <FluidNavCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* ── THINGS I LOVE ABOUT YOU ── */}
      <section className="py-28 px-6 md:px-20 relative overflow-hidden">
        {/* faint background blob */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
            things i actually think about
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-foreground mb-16 leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Why you're{" "}
            <em className="gradient-text not-italic">everything</em>
          </h2>

          {/* Cloud layout — 3 staggered rows, no overlaps */}
          <div className="flex flex-col gap-16">

            {/* Row 1: left-leaning + right-leaning */}
            <div className="flex items-end gap-8 justify-between">
              <div className="w-[45%]">
                <CloudCard no="01" label="Her Laugh" text="The way you laugh — genuinely, loudly, without caring who's watching. It makes the whole room better." index={0} />
              </div>
              <div className="w-[48%] mb-10">
                <CloudCard no="02" label="She Listens" text="How you remember small things I mentioned once, months ago. It means you actually listen." index={1} />
              </div>
            </div>

            {/* Row 2: center-ish, offset from row 1 */}
            <div className="flex items-start gap-8 justify-around">
              <div className="w-[42%] mt-4">
                <CloudCard no="03" label="Her Fire" text="Your stubbornness. Infuriating sometimes, but it means you stand by what you believe in." index={2} />
              </div>
              <div className="w-[46%]">
                <CloudCard no="04" label="Her Heart" text="The way you care about people — deeply, quietly, without needing anyone to notice." index={3} />
              </div>
            </div>

            {/* Row 3: swapped sides from row 1 */}
            <div className="flex items-end gap-8 justify-between">
              <div className="w-[48%] mb-6">
                <CloudCard no="05" label="Magical Moments" text="That you make ordinary moments feel like something worth remembering." index={4} />
              </div>
              <div className="w-[43%]">
                <CloudCard no="06" label="She Grows Me" text="You make me want to be better. Not because you demand it — just because you deserve it." index={5} />
              </div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* ── COMIC HIGHLIGHT 2 ── */}
      <section className="py-24 flex flex-col items-center justify-center overflow-hidden bg-accent/10 relative">
        <motion.div
          initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          className="z-10 text-center px-4"
        >
          <ComicText fontSize={3.5} className="md:!text-[4rem] !text-[2.5rem] !text-[#EF4444]">
            when far away , RUN BACK TO ME
          </ComicText>
        </motion.div>
        {/* Floating background blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* ── TERMINAL ── */}
      <section className="py-24 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 md:gap-32"
        >
          {/* Left — text */}
          <div className="flex-1 max-w-md">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
              output: my heart
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Running on{" "}
              <span className="gradient-text">love.exe</span>
            </h2>
            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
            >
              If I could write a program that captures exactly what you mean to me, it would have no bugs — because you're perfect.
            </p>
          </div>

          {/* Right — terminal */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="comic-panel relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
              <Terminal className="w-full !max-w-full !border-0 !shadow-none !bg-white !text-black dark:!bg-white dark:!text-black rounded-xl z-10 relative">
                <TypingAnimation className="!text-black font-semibold" duration={40}>{"$ run love_message.sh"}</TypingAnimation>
                <AnimatedSpan className="!text-black/60 mt-1">Loading sentiments...</AnimatedSpan>
                <AnimatedSpan className="!text-[#D6006B] font-bold text-lg mt-3">{"when far away , RUN BACK TO ME"}</AnimatedSpan>
                <AnimatedSpan className="!text-[#D6006B] font-bold text-lg mt-2">{"YOU MATTER TO ME"}</AnimatedSpan>
                <AnimatedSpan className="!text-black/60 mt-4">Process completed successfully.</AnimatedSpan>
                <AnimatedSpan className="!text-black animate-pulse">▊</AnimatedSpan>
              </Terminal>
              <ShineBorder 
                className="z-20 pointer-events-none"
                shineColor={["#D44D5C", "#D6006B", "#E3B5A4"]}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 text-center border-t border-border/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <Heart className="w-8 h-8 text-primary fill-primary animate-heartbeat" />
          <p
            className="text-muted-foreground text-sm"
            style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
          >
            Made with love, for the one who has my heart.
          </p>
          <p className="text-muted-foreground/50 text-xs">June 15, 2025 — Happy Anniversary</p>
        </motion.div>
      </footer>
    </main>
  )
}
