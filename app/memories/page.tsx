"use client"

import { useRef, useState, Suspense } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react"
import { Navbar } from "@/components/navbar"
import { Marquee } from "@/components/ui/marquee"
import { MagicCard } from "@/components/ui/magic-card"
import { SparklesText } from "@/components/ui/sparkles-text"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { IconCloud } from "@/components/ui/icon-cloud"
import dynamic from "next/dynamic"
import { X } from "lucide-react"

const FloatingPhotoBall = dynamic(
  () => import("@/components/ui/floating-photo-ball").then((m) => m.FloatingPhotoBall),
  { ssr: false, loading: () => <div className="h-[450px] flex items-center justify-center text-primary/50 animate-pulse">Loading 3D...</div> }
)

// All images
const WA = Array.from({ length: 23 }, (_, i) => `/assets/wa${String(i + 1).padStart(3, "0")}.jpg`)
const IMGSet = [
  "IMG-20260613-WA0008", "IMG-20260613-WA0009", "IMG-20260613-WA0010",
  "IMG-20260613-WA0011", "IMG-20260613-WA0012", "IMG-20260613-WA0013",
  "IMG-20260613-WA0014", "IMG-20260613-WA0015", "IMG-20260613-WA0016",
  "IMG-20260613-WA0017", "IMG-20260613-WA0018", "IMG-20260613-WA0019",
  "IMG-20260613-WA0020", "IMG-20260613-WA0021", "IMG-20260613-WA0022",
  "IMG-20260613-WA0023", "IMG-20260613-WA0024", "IMG-20260613-WA0025",
  "IMG-20260613-WA0026", "IMG-20260613-WA0028", "IMG-20260613-WA0029",
  "IMG-20260613-WA0030", "IMG-20260613-WA0031", "IMG-20260613-WA0032",
  "IMG-20260613-WA0033", "IMG-20260613-WA0034", "IMG-20260613-WA0035",
  "IMG-20260613-WA0036", "IMG-20260613-WA0037", "IMG-20260613-WA0038",
  "IMG-20260613-WA0039", "IMG-20260613-WA0047", "IMG-20260613-WA0048",
  "IMG-20260613-WA0049", "IMG-20260613-WA0050", "IMG-20260613-WA0052",
  "IMG-20260613-WA0059", "IMG-20260613-WA0060", "IMG-20260613-WA0061",
  "IMG-20260613-WA0062", "IMG-20260613-WA0063", "IMG-20260613-WA0064",
  "IMG-20260613-WA0065", "IMG-20260613-WA0066", "IMG-20260613-WA0067",
  "IMG-20260613-WA0068", "IMG-20260613-WA0069", "IMG-20260613-WA0070",
  "IMG-20260613-WA0071", "IMG-20260613-WA0072",
].map((n) => `/assets/${n}.jpg`)

const ORIG = [
  "/IMG_20260518_120035.jpg", "/IMG_20260521_134522.jpg",
  "/IMG_20260521_134525.jpg", "/IMG_20260521_134529.jpg",
  "/IMG_20260526_133416.jpg",
]

const allImages = [...ORIG, ...IMGSet, ...WA]
const row1 = allImages.slice(0, 20)
const row2 = allImages.slice(20, 40)
const row3 = allImages.slice(40, 60)
const carouselImgs = allImages.slice(0, 18)
const cloudImgs = allImages.slice(20, 50).map(s => s)
const gridImgs = allImages.slice(50, 74)
const bigGridImgs = allImages.slice(0, 24)

const comicTags = [
  "ADORABLE 💖", "STUNNING ✨", "MY WORLD 🌍", "GORGEOUS 🌸",
  "QUEEN 👑", "CUTIE PIE 🍰", "SUNSHINE ☀️", "PERFECTION 💫",
  "BESTGIRL 🎀", "DREAMY 🌙", "LOVELY 🌺", "MY HEART 💕",
]

function ComicTag({ text, angle }: { text: string; angle: number }) {
  return (
    <div
      className="absolute px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_var(--foreground)] whitespace-nowrap pointer-events-none select-none z-20"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {text}
    </div>
  )
}

// GlitterCard — image card with animated pink spotlight border + glitter on hover
function GlitterCard({ src, tag }: { src: string; tag?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: -400, y: -400 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: -400, y: -400 }) }}
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        // Animated glitter border using conic + radial gradient
        padding: "2px",
        background: hovered
          ? `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, #f43f5e, #e879f9 40%, #fda4af 70%, #f9a8d4 100%)`
          : "linear-gradient(135deg, #f43f5e44, #e879f944, #fda4af44)",
        boxShadow: hovered
          ? "0 0 30px rgba(244,63,94,0.6), 0 0 60px rgba(232,121,249,0.3)"
          : "0 0 10px rgba(244,63,94,0.2)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Inner image container */}
      <div className="relative w-full h-full rounded-[10px] overflow-hidden">
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 block"
        />
        {/* Glitter spotlight glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 120px at ${mouse.x}px ${mouse.y}px, rgba(244,63,94,0.35), rgba(232,121,249,0.2) 50%, transparent 80%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
        {/* Sparkle dots on hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/80 animate-ping"
              style={{
                top: `${10 + i * 11}%`,
                left: `${6 + (i % 4) * 23}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        {tag && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-primary text-primary-foreground rounded-full border-2 border-foreground shadow-[2px_2px_0_0_var(--foreground)]">
            {tag}
          </div>
        )}
      </div>
    </div>
  )
}


function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl md:text-6xl font-black text-center mb-12 gradient-text relative inline-block"
      style={{ fontFamily: "var(--font-playfair), serif" }}
    >
      {children}
      <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-400 to-primary rounded-full" />
    </h2>
  )
}

export default function BestGirlPicsPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* === HERO === */}
      <section ref={heroRef} className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* BG collage blur */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 grid grid-cols-5 gap-1 opacity-20 scale-110">
          {bigGridImgs.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" />
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        {/* Floating comic tags */}
        <div className="absolute top-24 left-8 md:left-20"><ComicTag text="ADORABLE 💖" angle={-12} /></div>
        <div className="absolute top-32 right-8 md:right-20"><ComicTag text="MY QUEEN 👑" angle={8} /></div>
        <div className="absolute bottom-40 left-12 md:left-32"><ComicTag text="GORGEOUS ✨" angle={-6} /></div>
        <div className="absolute bottom-36 right-12 md:right-28"><ComicTag text="PERFECTION 💫" angle={10} /></div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ fontFamily: "var(--font-playfair), serif" }}>
              <SparklesText
                className="text-6xl md:text-9xl font-black tracking-tight"
                colors={{ first: "#ff6b9d", second: "#ffd6e7" }}
                sparklesCount={20}
              >
                bestgirl pics
              </SparklesText>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg md:text-2xl text-muted-foreground italic max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            A visual love letter. Every photo, a proof of how absolutely stunning you are.
          </motion.p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/60 text-sm"
        >
          ↓ scroll to adore ↓
        </motion.div>
      </section>

      {/* === SCROLL VELOCITY BAND === */}
      <section className="py-6 bg-primary/10 border-y border-primary/20 overflow-hidden">
        <ScrollVelocityContainer>
          <ScrollVelocityRow
            baseVelocity={-3}
            className="text-5xl font-black uppercase tracking-widest text-primary/70 py-1"
          >
            {comicTags.map((t, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2">{t} <span className="text-primary/40">•</span></span>
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow
            baseVelocity={3}
            className="text-5xl font-black uppercase tracking-widest text-primary/50 py-1"
          >
            {[...comicTags].reverse().map((t, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2">{t} <span className="text-primary/30">♡</span></span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* === MARQUEE ROW 1 === */}
      <section className="py-16 overflow-hidden">
        <ScrollReveal>
          <div className="text-center mb-10">
            <SectionTitle>Infinite Adoration</SectionTitle>
          </div>
        </ScrollReveal>
        <div className="relative flex flex-col gap-6 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:35s]" repeat={3}>
            {row1.map((src, i) => (
              <div key={i} className="mx-3 w-[220px] h-[280px] rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 shadow-xl hover:shadow-primary/30 transition-shadow hover:scale-105 duration-300" onClick={() => setLightbox(src)}>
                <img src={src} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:45s]" repeat={3}>
            {row2.map((src, i) => (
              <div key={i} className="mx-3 w-[180px] h-[240px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 shadow-lg hover:shadow-primary/20 transition-shadow hover:scale-105 duration-300" onClick={() => setLightbox(src)}>
                <img src={src} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:55s]" repeat={3}>
            {row3.map((src, i) => (
              <div key={i} className="mx-3 w-[160px] h-[200px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 shadow-md hover:scale-105 duration-300" onClick={() => setLightbox(src)}>
                <img src={src} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background" />
        </div>
      </section>

      {/* === GLITTER MAGIC CARD GRID === */}
      <section className="px-6 md:px-16 py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <SectionTitle>Glittering Frames</SectionTitle>
          </div>
        </ScrollReveal>

        {/* Bento-style collage grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {/* Big featured */}
          <motion.div
            className="col-span-2 row-span-2 h-[350px] md:h-[480px] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onClick={() => setLightbox(gridImgs[0])}
          >
            <GlitterCard src={gridImgs[0]} tag="BESTGIRL" />
          </motion.div>

          {gridImgs.slice(1, 5).map((src, i) => (
            <motion.div
              key={i}
              className="h-[160px] md:h-[230px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => setLightbox(src)}
            >
              <GlitterCard src={src} />
            </motion.div>
          ))}

          {/* Comic cloud tags scattered */}
          {gridImgs.slice(5, 9).map((src, i) => (
            <motion.div
              key={i + 5}
              className="h-[160px] md:h-[200px] relative"
              initial={{ opacity: 0, rotate: i % 2 === 0 ? -5 : 5, scale: 0.85 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, type: "spring" }}
              onClick={() => setLightbox(src)}
            >
              <GlitterCard src={src} tag={comicTags[i + 2]} />
            </motion.div>
          ))}

          {/* Another big card */}
          <motion.div
            className="col-span-2 h-[260px] md:h-[320px]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onClick={() => setLightbox(gridImgs[9])}
          >
            <GlitterCard src={gridImgs[9]} tag="STUNNING ✨" />
          </motion.div>

          {gridImgs.slice(10, 14).map((src, i) => (
            <motion.div
              key={i + 10}
              className="h-[120px] md:h-[150px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setLightbox(src)}
            >
              <GlitterCard src={src} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* === 3D PHOTO SPHERE + CAROUSEL SIDE BY SIDE === */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-br from-primary/5 via-background to-pink-50/30 dark:to-pink-950/10 rounded-[3rem] mx-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <SectionTitle>Center of My Universe 🌍</SectionTitle>
          </div>
        </ScrollReveal>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 3D sphere */}
          <div className="w-full lg:w-1/2">
            <FloatingPhotoBall images={allImages.slice(5, 35)} />
            <p className="text-center text-sm text-muted-foreground italic mt-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Drag to spin · Every frame, a reminder of how gorgeous you are
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            {/* Comic speech bubble */}
            <div className="relative bg-primary text-primary-foreground rounded-3xl rounded-bl-none p-6 border-4 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)]">
              <p className="text-2xl font-black italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                "Every picture of you makes my heart do that stupid little flip thing..."
              </p>
              <div className="absolute -bottom-6 left-8 w-0 h-0 border-l-[20px] border-l-transparent border-t-[24px] border-t-foreground" />
              <div className="absolute -bottom-4 left-9 w-0 h-0 border-l-[16px] border-l-transparent border-t-[20px] border-t-primary" />
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {carouselImgs.map((src, i) => (
                  <CarouselItem key={i} className="basis-1/2 md:basis-1/3">
                    <div
                      className="aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 border-primary/30 hover:border-primary transition-all shadow-lg hover:shadow-primary/30 hover:scale-105 duration-300"
                      onClick={() => setLightbox(src)}
                    >
                      <img src={src} className="w-full h-full object-cover" alt="" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-primary/30 bg-background/80" />
              <CarouselNext className="border-primary/30 bg-background/80" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* === ICON CLOUD BALL === */}
      <section className="py-24 px-6 md:px-16 flex flex-col items-center gap-10">
        <ScrollReveal>
          <div className="text-center">
            <SectionTitle>A Galaxy of Her 🌸</SectionTitle>
            <p className="text-muted-foreground italic mt-2 max-w-md mx-auto" style={{ fontFamily: "var(--font-playfair), serif" }}>
              An interactive cloud made entirely out of her beautiful pictures — just like how she fills every corner of my thoughts.
            </p>
          </div>
        </ScrollReveal>
        <div className="relative w-full max-w-4xl h-[680px] flex items-center justify-center mx-auto">
          <IconCloud images={cloudImgs} />
        </div>
      </section>

      {/* === COMIC PANEL COLLAGES === */}
      <section className="px-6 md:px-16 py-20 bg-primary/5 rounded-[3rem] mx-4 mb-20 border-4 border-[#160029] shadow-[8px_8px_0px_0px_#160029]">
        <ScrollReveal>
          <div className="text-center mb-16">
            <SectionTitle>Dynamic Memories</SectionTitle>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 place-items-center">
          {[0, 1, 2, 3].map((panelIdx) => {
            const rot = [-2, 3, -4, 2][panelIdx];
            const imgs = allImages.slice(panelIdx * 8, panelIdx * 8 + 8);
            const col1 = imgs.slice(0, 4);
            const col2 = imgs.slice(4, 8);
            return (
              <motion.div
                key={panelIdx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: panelIdx * 0.1, type: "spring" }}
                className="flex w-full justify-center"
              >
                <div
                  className="comic-panel relative flex h-[400px] md:h-[500px] w-full max-w-[320px] md:max-w-[400px] flex-row items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-[#160029] bg-white shadow-[6px_6px_0px_0px_#160029]"
                  style={{ rotate: `${rot}deg` }}
                >
                  <Marquee pauseOnHover vertical className="[--duration:20s]">
                    {col1.map((img, i) => (
                      <div key={i} className="mb-4">
                        <img
                          src={img}
                          alt="Memory"
                          onClick={() => setLightbox(img)}
                          className="comic-panel rounded-2xl w-32 md:w-40 object-cover object-center h-40 md:h-48 border-2 border-[#160029] cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </Marquee>
                  <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
                    {col2.map((img, i) => (
                      <div key={i} className="mb-4">
                        <img
                          src={img}
                          alt="Memory"
                          onClick={() => setLightbox(img)}
                          className="comic-panel rounded-2xl w-32 md:w-40 object-cover object-center h-40 md:h-48 border-2 border-[#160029] cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </Marquee>
                  
                  {/* Fade overlays */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent z-10 rounded-t-[2.5rem]"></div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent z-10 rounded-b-[2.5rem]"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* === FINAL TILTED COLLAGE WALL === */}
      <section className="px-6 md:px-16 pb-32 overflow-hidden">
        <ScrollReveal>
          <div className="text-center mb-16">
            <SectionTitle>Wall of Pretty 🎀</SectionTitle>
          </div>
        </ScrollReveal>

        {/* Staggered polaroid-style wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gridImgs.map((src, i) => {
            const angle = (i % 2 === 0 ? 1 : -1) * (Math.random() * 0 + (i % 3) * 1.5 - 1.5)
            return (
              <motion.div
                key={i}
                className="bg-white dark:bg-zinc-800 p-2 pb-8 shadow-xl cursor-pointer border border-foreground/10"
                style={{ rotate: angle }}
                initial={{ opacity: 0, y: 40, rotate: angle - 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: angle }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.07, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
                onClick={() => setLightbox(src)}
              >
                <img src={src} className="w-full aspect-square object-cover" alt="" />
                <p className="text-xs text-center mt-2 font-medium text-muted-foreground italic">
                  {comicTags[i % comicTags.length]}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* === BOTTOM MARQUEE === */}
      <section className="py-8 bg-primary/10 border-t border-primary/20 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]" repeat={5}>
          {["you're gorgeous 💗", "literally stunning 🌸", "prettiest girl 👑", "i adore you 🌙", "my whole world ✨"].map((t, i) => (
            <span key={i} className="mx-10 text-2xl font-black italic text-primary/80" style={{ fontFamily: "var(--font-playfair), serif" }}>{t}</span>
          ))}
        </Marquee>
      </section>

      {/* === LIGHTBOX === */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative max-w-4xl max-h-[90vh] w-full rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black rounded-full p-2 text-white backdrop-blur"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={lightbox} className="w-full max-h-[90vh] object-contain" alt="" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
