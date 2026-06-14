"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Navbar } from "@/components/navbar"
import { TextAnimate } from "@/components/ui/text-animate"
import { Meteors } from "@/components/ui/meteors"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Heart, Star, Zap } from "lucide-react"

type FallingItem = {
  id: number
  x: number
  speed: number
  size: number
  type: "heart" | "star" | "bomb"
  emoji: string
  points: number
}

const GAME_WIDTH = 600
const GAME_HEIGHT = 480
const BASKET_WIDTH = 80
const ITEM_INTERVAL = 900

function useGameLoop(running: boolean, cb: (dt: number) => void) {
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return
    const loop = (now: number) => {
      const dt = Math.min((now - (lastRef.current || now)) / 1000, 0.05)
      lastRef.current = now
      cb(dt)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, cb])
}

export default function MiniGamePage() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2)
  const [items, setItems] = useState<FallingItem[]>([])
  const [caught, setCaught] = useState<{ id: number; x: number; y: number; emoji: string; points: number } | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [message, setMessage] = useState("")
  const nextId = useRef(0)
  const spawnTimer = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)

  const spawnItem = useCallback(() => {
    const r = Math.random()
    let type: FallingItem["type"]
    let emoji: string
    let points: number

    if (r < 0.1) { type = "bomb"; emoji = "💣"; points = -5 }
    else if (r < 0.25) { type = "star"; emoji = "⭐"; points = 3 }
    else { type = "heart"; emoji = "❤️"; points = 1 }

    const item: FallingItem = {
      id: nextId.current++,
      x: Math.random() * (GAME_WIDTH - 40) + 20,
      speed: 80 + Math.random() * 60 + score * 0.8,
      size: 28 + Math.random() * 14,
      type,
      emoji,
      points,
    }
    setItems((prev) => [...prev, item])
  }, [score])

  const tick = useCallback(
    (dt: number) => {
      spawnTimer.current += dt * 1000
      if (spawnTimer.current >= ITEM_INTERVAL) {
        spawnTimer.current = 0
        spawnItem()
      }

      setItems((prev) => {
        const next: FallingItem[] = []
        const caught: typeof prev = []

        for (const item of prev) {
          const newY = (item as any).y ?? 0
          const moved = newY + item.speed * dt

          const inBasket =
            moved >= GAME_HEIGHT - 60 &&
            item.x >= basketX - 20 &&
            item.x <= basketX + BASKET_WIDTH + 20

          if (inBasket) {
            caught.push({ ...item, y: moved } as any)
          } else if (moved < GAME_HEIGHT) {
            next.push({ ...item, y: moved } as any)
          } else {
            // missed
            if (item.type !== "bomb") {
              setLives((l) => {
                if (l - 1 <= 0) setGameState("over")
                return Math.max(0, l - 1)
              })
            }
          }
        }

        if (caught.length > 0) {
          const first = caught[0] as any
          setScore((s) => {
            const newScore = Math.max(0, s + caught.reduce((a, c) => a + c.points, 0))
            if (newScore > highScore) setHighScore(newScore)
            return newScore
          })
          setCaught({ id: first.id, x: first.x, y: first.y, emoji: first.emoji, points: first.points })
          setTimeout(() => setCaught(null), 500)
        }

        return next
      })
    },
    [basketX, highScore, spawnItem]
  )

  useGameLoop(gameState === "playing", tick)

  // Mouse / touch control
  useEffect(() => {
    if (gameState !== "playing") return
    const el = gameRef.current
    if (!el) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH
      setBasketX(Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, relX - BASKET_WIDTH / 2)))
    }

    const onTouchMove = (e: TouchEvent) => {
      const rect = el.getBoundingClientRect()
      const touch = e.touches[0]
      const relX = ((touch.clientX - rect.left) / rect.width) * GAME_WIDTH
      setBasketX(Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, relX - BASKET_WIDTH / 2)))
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("touchmove", onTouchMove, { passive: true })
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [gameState])

  const startGame = () => {
    setScore(0)
    setLives(3)
    setItems([])
    setBasketX(GAME_WIDTH / 2 - BASKET_WIDTH / 2)
    nextId.current = 0
    spawnTimer.current = 0
    setGameState("playing")
  }

  return (
    <main className="min-h-screen relative">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <Meteors number={8} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1
            className="text-5xl md:text-7xl font-bold gradient-text mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Catch Our Love
          </h1>
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-muted-foreground text-lg max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
          >
            Catch the hearts, grab the stars — but avoid the bombs! Made just for us.
          </TextAnimate>
        </motion.div>
      </section>

      {/* Game area */}
      <section className="px-4 pb-24 flex flex-col items-center gap-6">
        {/* Stats bar */}
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <div className="glass px-5 py-2 rounded-full flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="font-bold text-primary">{score}</span>
            <span className="text-muted-foreground text-sm">pts</span>
          </div>
          <div className="glass px-5 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Lives:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? "text-primary fill-primary" : "text-muted/40"}`}
              />
            ))}
          </div>
          <div className="glass px-5 py-2 rounded-full flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-muted-foreground">Best:</span>
            <span className="font-bold">{highScore}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm text-muted-foreground flex-wrap justify-center">
          <span>❤️ +1 pt</span>
          <span>⭐ +3 pts</span>
          <span>💣 -5 pts</span>
        </div>

        {/* Canvas */}
        <div
          ref={gameRef}
          className="relative bg-card/80 glass border border-primary/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/15"
          style={{ width: "min(600px, 96vw)", aspectRatio: "600/480" }}
        >
          {/* Falling items */}
          {gameState === "playing" && items.map((item) => (
            <div
              key={item.id}
              className="absolute select-none pointer-events-none leading-none"
              style={{
                left: `${(item.x / GAME_WIDTH) * 100}%`,
                top: `${(((item as any).y ?? 0) / GAME_HEIGHT) * 100}%`,
                fontSize: item.size,
                transform: "translate(-50%, -50%)",
              }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Basket */}
          {gameState === "playing" && (
            <motion.div
              className="absolute bottom-6 flex items-center justify-center"
              style={{
                left: `${(basketX / GAME_WIDTH) * 100}%`,
                width: `${(BASKET_WIDTH / GAME_WIDTH) * 100}%`,
              }}
              animate={{ left: `${(basketX / GAME_WIDTH) * 100}%` }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="glass border-2 border-primary rounded-2xl px-4 py-2 text-2xl shadow-lg shadow-primary/30 select-none">
                🫶
              </div>
            </motion.div>
          )}

          {/* Catch popup */}
          <AnimatePresence>
            {caught && (
              <motion.div
                key={caught.id}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -40, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute pointer-events-none text-xl font-bold"
                style={{
                  left: `${(caught.x / GAME_WIDTH) * 100}%`,
                  top: `${((caught.y - 20) / GAME_HEIGHT) * 100}%`,
                  transform: "translate(-50%,-50%)",
                  color: caught.points < 0 ? "#D44D5C" : caught.points > 1 ? "#fbbf24" : "#E3B5A4",
                }}
              >
                {caught.points > 0 ? `+${caught.points}` : caught.points} {caught.emoji}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay states */}
          <AnimatePresence>
            {gameState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/70 backdrop-blur-sm"
              >
                <div className="text-5xl animate-heartbeat">❤️</div>
                <h2
                  className="text-3xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Catch the Hearts!
                </h2>
                <p className="text-muted-foreground text-center max-w-xs px-4 text-sm">
                  Move your cursor (or touch) to catch falling hearts and stars. Avoid the bombs!
                </p>
                <InteractiveHoverButton
                  className="bg-primary text-primary-foreground border-primary px-8 rounded-full"
                  onClick={startGame}
                >
                  Start Playing
                </InteractiveHoverButton>
              </motion.div>
            )}

            {gameState === "over" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-background/80 backdrop-blur-sm"
              >
                <div className="text-5xl">💔</div>
                <h2
                  className="text-3xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Game Over!
                </h2>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-muted-foreground">Score: <strong className="text-primary text-xl">{score}</strong></p>
                  {score >= highScore && score > 0 && (
                    <p className="text-yellow-500 text-sm font-semibold">New High Score!</p>
                  )}
                </div>
                {score >= 15 ? (
                  <p
                    className="text-foreground text-center max-w-xs px-4"
                    style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
                  >
                    Amazing! Just like you catch my heart every single day.
                  </p>
                ) : (
                  <p
                    className="text-muted-foreground text-center max-w-xs px-4"
                    style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
                  >
                    Don't worry, you've already caught the most important heart — mine.
                  </p>
                )}
                <InteractiveHoverButton
                  className="bg-primary text-primary-foreground border-primary px-8 rounded-full"
                  onClick={startGame}
                >
                  Play Again
                </InteractiveHoverButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
