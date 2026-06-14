"use client"

import { useRef, useMemo, Suspense, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function PhotoSphere({ images }: { images: string[] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [textures, setTextures] = useState<THREE.Texture[]>([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    const subset = images.slice(0, 28)
    Promise.all(
      subset.map((src) =>
        new Promise<THREE.Texture>((resolve) => {
          loader.load(src, resolve, undefined, () => {
            const t = new THREE.Texture(); resolve(t)
          })
        })
      )
    ).then(setTextures)
  }, [images])

  const positions = useMemo<[number, number, number][]>(() => {
    const count = 28
    const phi = Math.PI * (3 - Math.sqrt(5))
    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = phi * i
      return [Math.cos(theta) * r * 4.2, y * 4.2, Math.sin(theta) * r * 4.2]
    })
  }, [])

  useFrame((s) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = s.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.04) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => {
        const tex = textures[i]
        if (!tex || !tex.image) return null
        return (
          <mesh key={i} position={pos}>
            <planeGeometry args={[1.0, 1.3]} />
            <meshStandardMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.88} />
          </mesh>
        )
      })}
    </group>
  )
}

function Sparkles3D() {
  const ref = useRef<THREE.Points>(null!)
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16
    }
    return pos
  }, [])

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.06
      ref.current.rotation.x = s.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ff9a9e" sizeAttenuation transparent opacity={0.75} />
    </points>
  )
}

export function FloatingPhotoBall({ images }: { images: string[] }) {
  return (
    <div className="w-full h-[420px] md:h-[580px]">
      <Canvas camera={{ position: [0, 0, 11], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={1.0} />
        <pointLight position={[8, 8, 8]} intensity={1.5} color="#ff9a9e" />
        <pointLight position={[-8, -4, -4]} intensity={0.6} color="#fecfef" />
        <Suspense fallback={null}>
          <PhotoSphere images={images} />
          <Sparkles3D />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
