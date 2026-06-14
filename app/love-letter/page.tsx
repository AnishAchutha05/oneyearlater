"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react"
import { Navbar } from "@/components/navbar"
import { TextAnimate } from "@/components/ui/text-animate"
import { Meteors } from "@/components/ui/meteors"
import { SparklesText } from "@/components/ui/sparkles-text"
import { ComicText } from "@/components/ui/comic-text"
import { MagicCard } from "@/components/ui/magic-card"
import { ShineBorder } from "@/components/ui/shine-border"
import { Marquee } from "@/components/ui/marquee"
import { Heart, Lock, Unlock, Star, Sparkles } from "lucide-react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// ── Floating hearts background ──────────────────────────────────────────────
const HEARTS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (i * 13 + 7) % 100,
  size: 14 + (i * 3.7) % 16,
  delay: (i * 0.6) % 5,
  dur: 6 + (i * 0.8) % 5,
  color: ["#f43f5e", "#ec4899", "#d946ef", "#fda4af"][i % 4],
}))

function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.x}%`, bottom: -40 }}
          animate={{ y: ["0vh", "-120vh"], opacity: [0, 0.7, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
        >
          <Heart
            style={{ width: h.size, height: h.size, color: h.color, fill: h.color }}
            strokeWidth={0}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ── Marquee strip ────────────────────────────────────────────────────────────
const marqWords = ["I LOVE YOU", "✦", "TO THE MOON AND BACK", "✦", "MY FOREVER PERSON", "✦", "ADIBUNNY", "✦"]

// ── Envelope component ───────────────────────────────────────────────────────
function EnvelopeOpen({ onOpen }: { onOpen: () => void }) {
  const [hover, setHover] = useState(false)

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7, y: -60 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/* Comic title */}
      <ComicText fontSize={2.2} className="!text-[#f43f5e] text-center">
        A letter just for you
      </ComicText>

      {/* Envelope */}
      <motion.div
        className="relative w-80 h-56 cursor-pointer"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onClick={onOpen}
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.96 }}
        style={{ transformPerspective: 800 }}
      >
        {/* Card border */}
        <ShineBorder
          className="absolute inset-0 rounded-3xl pointer-events-none"
          shineColor={["#f43f5e", "#ec4899", "#fda4af"]}
        />

        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fff8f5 60%, #fce7f3)",
            border: "3px solid #f43f5e",
            boxShadow: "6px 6px 0px 0px #160029",
          }}
        >
          {/* Flap triangle */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: 0,
              borderLeft: "160px solid transparent",
              borderRight: "160px solid transparent",
              borderTop: hover ? "70px solid #fecdd3" : "70px solid #fda4af",
              transition: "border-top-color 0.3s",
              zIndex: 2,
            }}
          />
          {/* Bottom fold lines */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 0,
              borderLeft: "160px solid transparent",
              borderRight: "160px solid transparent",
              borderBottom: "70px solid #fce7f3",
              opacity: 0.6,
            }}
          />
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 z-10">
            <motion.div animate={{ scale: hover ? 1.3 : 1, rotate: hover ? 15 : 0 }}>
              <Heart className="w-14 h-14 text-primary fill-primary animate-heartbeat" />
            </motion.div>
            <p
              className="text-primary/70 text-sm text-center px-8 italic"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              sealed with love
            </p>
          </div>
        </div>

        {/* Lock / unlock */}
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full p-2 shadow-lg"
          style={{ background: "#f43f5e", boxShadow: "3px 3px 0px #160029", border: "2px solid #160029" }}
          animate={{ scale: hover ? 0 : 1, opacity: hover ? 0 : 1 }}
        >
          <Lock className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full p-2 shadow-lg"
          style={{ background: "#ec4899", boxShadow: "3px 3px 0px #160029", border: "2px solid #160029" }}
          animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        >
          <Unlock className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <p
        className="text-muted-foreground text-base italic"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Click to open your letter 💌
      </p>

      <InteractiveHoverButton
        className="bg-primary text-white border-primary px-10 rounded-full font-bold"
        onClick={onOpen}
      >
        Open Letter ✉️
      </InteractiveHoverButton>
    </motion.div>
  )
}

// ── The actual letter ────────────────────────────────────────────────────────
const letterSections = [
  {
    heading: "My Dearest Adibunny,",
    tag: "01",
    body: `Lessgooo — we actually did it. One full year. Three hundred and sixty-five days of laughter, long calls, stolen glances, and a love that somehow keeps growing bigger than I know how to put into words. I genuinely cannot believe we are here, and yet — here we are. And honestly? I wouldn't trade a single second of it.`,
  },
  {
    heading: "The Beginning",
    tag: "02",
    body: `I still remember the first time we really looked at each other. It was during exams, our very first semester. The room was loud with anxiety, everyone buried in their notes — and then there was you. There was something in that moment, something quiet and certain, like the universe nudging me and saying: pay attention to this one. I didn't fully understand it then. I do now.`,
  },
  {
    heading: "Everyday Magic",
    tag: "03",
    body: `What I didn't expect was how beautifully ordinary the extraordinary would become. Listening to you breathe softly over the phone every single night is, without exaggeration, one of my favourite sounds in the entire world. It tells me you're close. It tells me you're safe. It tells me that no matter how loud the day was, the night still belongs to us — and that is everything.`,
  },
  {
    heading: "What You Do To Me",
    tag: "04",
    body: `You make my days brighter, baby. Not in the easy, poetic way people throw around carelessly — I mean it in the very real, very specific sense that the moment I see your name light up my screen, everything else fades a little. You hold me when I am at the edge of breaking, and you do it so effortlessly, so completely, that I sometimes forget I was close to falling at all. That's a rare kind of love. And you give it without even realising.`,
  },
  {
    heading: "The Way You Build Me",
    tag: "05",
    body: `You point out when I'm wrong. You don't do it to tear me down — you do it because you actually believe in who I could become. You call out the worst of me with the patience of someone who already sees the best. You challenge me to be the right version of myself, not just the comfortable one. And because of that, I am genuinely a better person than I was when we met. You are not just the love of my life — you are one of the most important forces in it.`,
  },
  {
    heading: "My Declaration",
    tag: "06",
    body: `I love you. I want to say that simply, without decoration, because sometimes the plain truth is the most powerful thing: I love you. You matter to me — deeply, permanently, unconditionally. And no matter how far things get, no matter how many times you might push me away in frustration or fear — I will always come back. I will always run back to you. That is not a promise I make lightly. That is just the truth of how I feel.`,
  },
  {
    heading: "My Future",
    tag: "07",
    body: `You are the woman of my dreams. I mean that in the most honest, grounded, non-cliché way I know. I see a future with you and it doesn't scare me — it excites me. I want to do life with you: the big things and the tiny Thursday-afternoon things. I want to grow old arguing about nonsense and laughing about it five minutes later. You are already my person. You will always be my person.`,
  },
  {
    heading: "To the Moon and Back",
    tag: "∞",
    body: `I love you to the moon and back — and I know how cheesy that sounds, but I mean every syllable of it. Happy one year, my favourite human. Here's to every year after this. You are, without question, the best thing that has ever happened to me.`,
  },
]

function LetterContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-border/30">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: progressWidth,
            background: "linear-gradient(90deg, #f43f5e, #ec4899, #d946ef)",
          }}
        />
      </div>

      {/* Paper */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #fff8f5 0%, #fce7f3 100%)",
          border: "3px solid #160029",
          boxShadow: "8px 8px 0px 0px #160029",
        }}
      >
        {/* Lined paper background */}
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-b border-primary/8 pointer-events-none"
            style={{ top: `${72 + i * 46}px` }}
          />
        ))}
        {/* Red margin line */}
        <div className="absolute left-[72px] top-0 bottom-0 border-l-2 border-primary/20 pointer-events-none md:left-[88px]" />

        {/* Corner stamps */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-60">
          {["#f43f5e", "#ec4899", "#d946ef"].map((c, i) => (
            <div key={i} className="w-8 h-10 rounded-sm border border-primary/40" style={{ background: c + "22" }} />
          ))}
        </div>

        <div className="relative z-10 p-8 md:p-14 pl-16 md:pl-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 text-right"
          >
            <p className="text-sm text-muted-foreground italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
              June 15, 2025 — Our Anniversary
            </p>
          </motion.div>

          {/* Letter sections */}
          {letterSections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="mb-10"
            >
              <MagicCard
                className="p-5 mb-3 rounded-2xl border-0 bg-transparent"
                gradientColor="#f43f5e22"
                gradientSize={160}
                showBackground={false}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-block text-[10px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(90deg, #f43f5e, #ec4899)" }}
                  >
                    {s.tag}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      background: "linear-gradient(90deg, #f43f5e, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.heading}
                  </h3>
                </div>

                <p
                  className="text-foreground/85 text-base md:text-[17px] leading-[2.0] love-letter-body"
                >
                  {s.body}
                </p>
              </MagicCard>
            </motion.div>
          ))}

          {/* Special credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="my-8"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #fce7f3, #fff8f5)",
                border: "2px dashed #ec4899",
              }}
            >
              <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">★ Special Credits ★</p>
              <p className="text-foreground/75 italic text-sm" style={{ fontFamily: "var(--font-playfair), serif" }}>
                A very special thank-you to <strong className="text-primary">Prajna</strong> — the real MVP of this
                entire operation. She delivered an astonishing number of pictures of you with clutch timing and zero
                questions asked. Could not have built this without her. Absolute legend.
              </p>
            </div>
          </motion.div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col items-end gap-3"
          >
            <p className="text-muted-foreground italic text-base" style={{ fontFamily: "var(--font-playfair), serif" }}>
              With every piece of my heart,
            </p>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary fill-primary animate-heartbeat" />
              <div style={{ fontFamily: "var(--font-playfair), serif" }}>
                <div
                  className="text-4xl font-bold italic"
                  style={{
                    background: "linear-gradient(90deg, #f43f5e, #d946ef)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Anish Achutha
                </div>
                <div className="text-xs text-muted-foreground text-right tracking-widest uppercase mt-0.5">
                  [husband] 💍
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LoveLetterPage() {
  const [opened, setOpened] = useState(false)

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <FloatingHearts />

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" />
        <Meteors number={14} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          {/* Big comic tag */}
          <ComicText fontSize={1.4} className="!text-[#ec4899] mb-2">
            ✦ one year ✦
          </ComicText>

          {/* Sparkle title */}
          <div style={{ fontFamily: "var(--font-playfair), serif" }}>
            <SparklesText
              className="text-5xl md:text-7xl font-bold"
              colors={{ first: "#f43f5e", second: "#d946ef" }}
              sparklesCount={10}
            >
              A Letter For You
            </SparklesText>
          </div>

          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-muted-foreground text-lg max-w-xl mx-auto italic"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Written from the heart. Sealed with love. Signed by yours truly.
          </TextAnimate>
        </motion.div>
      </section>

      {/* Marquee strip */}
      <div className="py-3 overflow-hidden border-y border-primary/20 bg-primary/5 mb-10">
        <Marquee className="[--duration:22s]" pauseOnHover>
          {[...marqWords, ...marqWords].map((w, i) => (
            <span
              key={i}
              className="mx-6 text-sm font-black uppercase tracking-[0.2em] text-primary/60 select-none"
            >
              {w}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Letter content */}
      <section className="px-6 md:px-16 pb-32 flex justify-center relative z-10">
        <AnimatePresence mode="wait">
          {!opened ? (
            <EnvelopeOpen key="envelope" onOpen={() => setOpened(true)} />
          ) : (
            <LetterContent key="letter" />
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
