"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Float, OrbitControls } from "@react-three/drei"
import { useReducedMotion } from "framer-motion"
import type { Mesh } from "three"

export type HeroPiece = "box" | "stock" | "vault"

const LABELS: Record<HeroPiece, { kicker: string; title: string }> = {
  box: { kicker: "Sealed product", title: "VICE" },
  stock: { kicker: "Company stock", title: "TTWO" },
  vault: { kicker: "Vault", title: "Claim" },
}

function SealedBox({
  active,
  onHover,
}: {
  active: boolean
  onHover: (piece: HeroPiece | null) => void
}) {
  return (
    <group
      position={[-1.25, 0.15, 0.15]}
      rotation={[0.08, 0.45, 0.04]}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover("box")
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh castShadow>
        <boxGeometry args={[1.35, 1.7, 0.42]} />
        <meshStandardMaterial
          color={active ? "#e7d3b0" : "#c4a574"}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.15, 0.22]}>
        <boxGeometry args={[1.38, 0.28, 0.02]} />
        <meshStandardMaterial color="#e24b3b" roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[0, -0.42, 0.22]}>
        <boxGeometry args={[0.72, 0.16, 0.02]} />
        <meshStandardMaterial color="#1a120c" roughness={0.6} />
      </mesh>
    </group>
  )
}

function StockSlab({
  active,
  onHover,
}: {
  active: boolean
  onHover: (piece: HeroPiece | null) => void
}) {
  return (
    <group
      position={[1.15, 0.05, -0.1]}
      rotation={[-0.12, -0.4, 0.08]}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover("stock")
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh castShadow>
        <boxGeometry args={[1.55, 1.05, 0.08]} />
        <meshStandardMaterial
          color={active ? "#2a2a2a" : "#141414"}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.22, 0.05]}>
        <boxGeometry args={[0.7, 0.08, 0.01]} />
        <meshStandardMaterial color="#f4f4f4" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.35, -0.18, 0.05]}>
        <boxGeometry args={[0.42, 0.42, 0.01]} />
        <meshStandardMaterial color="#e24b3b" roughness={0.45} />
      </mesh>
    </group>
  )
}

function VaultPuck({
  active,
  onHover,
}: {
  active: boolean
  onHover: (piece: HeroPiece | null) => void
}) {
  const disc = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (!disc.current) return
    disc.current.rotation.z += delta * 0.35
  })

  return (
    <group
      position={[0.15, -0.95, 0.55]}
      rotation={[1.15, 0.2, 0]}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover("vault")
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh ref={disc} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
        <meshStandardMaterial
          color={active ? "#ffffff" : "#d9d9d9"}
          roughness={0.22}
          metalness={0.72}
        />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
        <meshStandardMaterial color="#e24b3b" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}

function Rig({
  active,
  onHover,
  reduce,
}: {
  active: HeroPiece | null
  onHover: (piece: HeroPiece | null) => void
  reduce: boolean
}) {
  const pieces = (
    <>
      <SealedBox active={active === "box"} onHover={onHover} />
      <StockSlab active={active === "stock"} onHover={onHover} />
      <VaultPuck active={active === "vault"} onHover={onHover} />
    </>
  )

  return (
    <group position={[0.85, 0.15, 0]}>
      {reduce ? pieces : (
        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
          {pieces}
        </Float>
      )}
    </group>
  )
}

export function HeroScene({
  active,
  onHover,
}: {
  active: HeroPiece | null
  onHover: (piece: HeroPiece | null) => void
}) {
  const reduce = useReducedMotion() ?? false

  return (
    <Canvas
      camera={{ position: [0, 0.35, 5.4], fov: 32 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={["#070707"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#8ec8ff" />
      <spotLight position={[0, 4, 2]} intensity={8} angle={0.5} penumbra={0.8} color="#fff4ea" />
      <Rig active={active} onHover={onHover} reduce={reduce} />
      <ContactShadows position={[0.6, -1.7, 0]} opacity={0.45} scale={9} blur={2.6} far={3.5} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduce}
        autoRotateSpeed={0.45}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  )
}

export function heroPieceCopy(piece: HeroPiece | null) {
  if (!piece) return { kicker: "Drag to turn", title: "Sealed, stock, vault" }
  return LABELS[piece]
}
