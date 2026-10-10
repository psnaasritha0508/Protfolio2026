/**
 * BackgroundCanvas.tsx
 *
 * Fixed 3D scene rendered behind all page content (pointer-events-none).
 * Primitives: floating spheres, tori, and glass tetrahedra.
 * Material:   MeshPhysicalMaterial — high transmission (glass), low roughness,
 *             iridescent rim, pastel specular highlights.
 * Camera rig: scroll-driven spline path — position + rotation lerp each frame
 *             so geometry glides smoothly as the user scrolls.
 * Performance: DPR clamped [1, 2]; fog culls distant fragments early.
 */

import { Environment, Float } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { scroll } from '../lib/scrollStore'

/* ═══════════════════════════════════════════════════════════════════════
   Shape definitions
   ═══════════════════════════════════════════════════════════════════════ */

type ShapeKind = 'sphere' | 'torus' | 'tetrahedron'

interface ShapeDef {
  kind:         ShapeKind
  position:     [number, number, number]
  scale:        number
  /** Initial Euler rotation (radians) */
  rotation:     [number, number, number]
  /** Slow self-rotation per-frame multiplier */
  spinRate:     [number, number, number]
  color:        string
  /** Float component speed (0 = no float) */
  floatSpeed:   number
  /** MeshPhysicalMaterial knobs */
  transmission: number
  roughness:    number
  thickness:    number
  iridescence:  number
  specularColor:string
}

const SHAPES: ShapeDef[] = [
  /* ── Spheres ──────────────────────────────────────────────────── */
  {
    kind: 'sphere', position: [-5.5,  4.5, -4], scale: 2.8,
    rotation: [0, 0, 0], spinRate: [0.001, 0.002, 0],
    color: '#c4b5fd', floatSpeed: 1.1,
    transmission: 0.93, roughness: 0.02, thickness: 2.2, iridescence: 0.90,
    specularColor: '#E0D7FF',
  },
  {
    kind: 'sphere', position: [ 5.5, -3.0, -5], scale: 2.3,
    rotation: [0, 0, 0], spinRate: [0.002, 0.001, 0],
    color: '#f9a8d4', floatSpeed: 0.75,
    transmission: 0.90, roughness: 0.03, thickness: 1.8, iridescence: 0.85,
    specularColor: '#FFD6E8',
  },
  {
    kind: 'sphere', position: [-1.0, -9.0, -6], scale: 1.7,
    rotation: [0, 0, 0], spinRate: [0.003, 0.001, 0.001],
    color: '#6ee7b7', floatSpeed: 1.35,
    transmission: 0.91, roughness: 0.04, thickness: 1.5, iridescence: 0.80,
    specularColor: '#C7F9E8',
  },

  /* ── Tori ─────────────────────────────────────────────────────── */
  {
    kind: 'torus', position: [ 4.5,  7.0, -7], scale: 1.8,
    rotation: [0.8, 0.4, 0.2], spinRate: [0.002, 0.003, 0.001],
    color: '#7dd3fc', floatSpeed: 0.90,
    transmission: 0.88, roughness: 0.05, thickness: 0.8, iridescence: 0.95,
    specularColor: '#BEE3F8',
  },
  {
    kind: 'torus', position: [-4.5, -6.0, -4], scale: 1.5,
    rotation: [0.3, 0.9, 0.5], spinRate: [0.003, 0.002, 0.002],
    color: '#fda4af', floatSpeed: 1.20,
    transmission: 0.86, roughness: 0.06, thickness: 0.7, iridescence: 0.88,
    specularColor: '#FFD6E8',
  },
  {
    kind: 'torus', position: [ 2.0, -14.0, -5], scale: 2.0,
    rotation: [1.2, 0.3, 0.1], spinRate: [0.001, 0.004, 0.001],
    color: '#c4b5fd', floatSpeed: 0.80,
    transmission: 0.90, roughness: 0.04, thickness: 0.9, iridescence: 0.92,
    specularColor: '#E0D7FF',
  },

  /* ── Tetrahedra (detail=1 → 16 faces, crystalline chamfered look) ── */
  {
    kind: 'tetrahedron', position: [-6.0, -1.5, -5], scale: 1.7,
    rotation: [0.5, 0.3, 0.8], spinRate: [0.003, 0.005, 0.002],
    color: '#E0D7FF', floatSpeed: 1.00,
    transmission: 0.91, roughness: 0.03, thickness: 1.2, iridescence: 0.85,
    specularColor: '#c4b5fd',
  },
  {
    kind: 'tetrahedron', position: [ 3.5, -11.0, -4], scale: 2.1,
    rotation: [0.2, 0.8, 0.4], spinRate: [0.004, 0.002, 0.003],
    color: '#FFD6E8', floatSpeed: 1.40,
    transmission: 0.88, roughness: 0.05, thickness: 1.4, iridescence: 0.88,
    specularColor: '#f9a8d4',
  },
  {
    kind: 'tetrahedron', position: [-2.5,  9.0, -7], scale: 1.4,
    rotation: [0.9, 0.1, 0.6], spinRate: [0.002, 0.003, 0.004],
    color: '#C7F9E8', floatSpeed: 0.70,
    transmission: 0.92, roughness: 0.04, thickness: 1.0, iridescence: 0.80,
    specularColor: '#6ee7b7',
  },
]

/* ═══════════════════════════════════════════════════════════════════════
   Camera spline path
   Five control points sampled at evenly-spaced scroll percentages.
   The rig lerps toward the interpolated point each frame.
   ═══════════════════════════════════════════════════════════════════════ */

const CAM_PATH = [
  /* t=0.00 */ { pos: new THREE.Vector3(  0,    0,  12), rot: new THREE.Euler( 0.00,  0.00, 0) },
  /* t=0.25 */ { pos: new THREE.Vector3(-2.0,  -5,  11), rot: new THREE.Euler( 0.05,  0.10, 0) },
  /* t=0.50 */ { pos: new THREE.Vector3( 2.0, -10, 11.5), rot: new THREE.Euler(-0.04, -0.10, 0) },
  /* t=0.75 */ { pos: new THREE.Vector3(-1.5, -15,  10), rot: new THREE.Euler( 0.06,  0.12, 0) },
  /* t=1.00 */ { pos: new THREE.Vector3( 0.5, -20,  10), rot: new THREE.Euler( 0.02,  0.05, 0) },
]

/** Linearly interpolate between two camera keyframes. */
function sampleCamPath(t: number): { pos: THREE.Vector3; rot: THREE.Euler } {
  const clamped = Math.max(0, Math.min(1, t))
  const n       = CAM_PATH.length - 1          // number of segments
  const scaled  = clamped * n
  const i       = Math.min(Math.floor(scaled), n - 1)
  const alpha   = scaled - i

  const a = CAM_PATH[i]
  const b = CAM_PATH[i + 1]

  return {
    pos: new THREE.Vector3().lerpVectors(a.pos, b.pos, alpha),
    rot: new THREE.Euler(
      THREE.MathUtils.lerp(a.rot.x, b.rot.x, alpha),
      THREE.MathUtils.lerp(a.rot.y, b.rot.y, alpha),
      0,
    ),
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   Shape geometry selector
   ═══════════════════════════════════════════════════════════════════════ */

function ShapeGeometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case 'sphere':
      // 64×64 segments → smooth silhouette for glass refraction
      return <sphereGeometry args={[1, 64, 64]} />
    case 'torus':
      // tube radius 0.30, 32 tubular, 64 radial for smooth cross-section
      return <torusGeometry args={[1, 0.30, 32, 64]} />
    case 'tetrahedron':
      // detail=1 → 16 faces, gives a soft chamfered-crystal appearance
      // through the high-transmission material
      return <tetrahedronGeometry args={[1, 1]} />
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   Individual floating shape
   ═══════════════════════════════════════════════════════════════════════ */

function Shape({
  kind, position, scale, rotation, spinRate,
  color, floatSpeed,
  transmission, roughness, thickness, iridescence, specularColor,
}: ShapeDef) {
  const meshRef = useRef<THREE.Mesh>(null!)

  // Self-rotation independent of Float oscillation
  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += spinRate[0]
    meshRef.current.rotation.y += spinRate[1]
    meshRef.current.rotation.z += spinRate[2]
  })

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.35}
      floatIntensity={1.0}
    >
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        rotation={rotation}
      >
        <ShapeGeometry kind={kind} />
        <meshPhysicalMaterial
          /* ── Core glass properties ─────────────────────── */
          color={color}
          transmission={transmission}     // 0.86 – 0.93 → near-transparent glass
          roughness={roughness}           // 0.02 – 0.06 → mirror-smooth surface
          thickness={thickness}           // refraction volume depth
          ior={1.5}                       // glass index of refraction

          /* ── Iridescent rim light ─────────────────────── */
          iridescence={iridescence}
          iridescenceIOR={1.38}
          iridescenceThicknessRange={[180, 900]}

          /* ── Pastel specular highlight ────────────────── */
          specularIntensity={1.2}
          specularColor={specularColor}

          /* ── Sheen (soft velvet edge glow) ────────────── */
          sheen={0.6}
          sheenColor={color}
          sheenRoughness={0.4}

          /* ── Environment ──────────────────────────────── */
          envMapIntensity={2.0}
          transparent
          opacity={0.80}
        />
      </mesh>
    </Float>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Coloured particle field — slow drift, vertex-coloured
   ═══════════════════════════════════════════════════════════════════════ */

function ParticleField() {
  const ref   = useRef<THREE.Points>(null!)
  const COUNT = 420

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const palette = [
      new THREE.Color('#E0D7FF'),
      new THREE.Color('#FFD6E8'),
      new THREE.Color('#C7F9E8'),
      new THREE.Color('#BEE3F8'),
    ]
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 44
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 8
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.010
    ref.current.rotation.x = clock.elapsedTime * 0.004
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Scroll-driven Camera Rig
   ─────────────────────────────────────────────────────────────────────
   Each frame:
   1. Sample the target position + rotation from the CAM_PATH spline.
   2. Lerp current camera state toward the target (LERP_SPEED controls lag).
   3. Write the lerped values back to state.camera.
   ═══════════════════════════════════════════════════════════════════════ */

const LERP_SPEED = 0.045   // lower = smoother / more lag; higher = snappier

function CameraRig() {
  // Persistent refs hold the *current* (lerped) values frame-to-frame
  const curPos = useRef(new THREE.Vector3(0, 0, 12))
  const curRot = useRef(new THREE.Euler(0, 0, 0))

  useFrame((state) => {
    const { pos: tgtPos, rot: tgtRot } = sampleCamPath(scroll.progress)

    // Lerp position
    curPos.current.lerp(tgtPos, LERP_SPEED)

    // Lerp rotation (Euler X / Y components)
    curRot.current.x = THREE.MathUtils.lerp(curRot.current.x, tgtRot.x, LERP_SPEED)
    curRot.current.y = THREE.MathUtils.lerp(curRot.current.y, tgtRot.y, LERP_SPEED)

    // Apply to camera
    state.camera.position.copy(curPos.current)
    state.camera.rotation.set(curRot.current.x, curRot.current.y, 0)
  })

  return null
}

/* ═══════════════════════════════════════════════════════════════════════
   Pastel light rig
   Four point lights at strategic positions; each coloured with a different
   palette swatch so shapes pick up pastel specular highlights from all
   directions as they rotate.
   ═══════════════════════════════════════════════════════════════════════ */

function PastelLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      {/* Primary: lavender from upper-right */}
      <pointLight position={[ 12,  12,  6]} intensity={3.0} color="#E0D7FF" />
      {/* Fill: rose from lower-left */}
      <pointLight position={[-10,  -9,  4]} intensity={2.2} color="#FFD6E8" />
      {/* Rim: mint from top-back */}
      <pointLight position={[  0,  18, -6]} intensity={1.8} color="#C7F9E8" />
      {/* Ground bounce: sky-blue from below */}
      <pointLight position={[  0, -22,  2]} intensity={1.0} color="#BEE3F8" />
      {/* Accent: warm lavender mid-field */}
      <pointLight position={[  6,   0, -2]} intensity={1.4} color="#c4b5fd" />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Canvas root — fixed behind all content, pointer-events-none
   ═══════════════════════════════════════════════════════════════════════ */

export default function BackgroundCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 2]}                  /* DPR clamped — maintains 60 FPS */
        gl={{
          antialias:         true,
          alpha:             false,
          toneMapping:       THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Deep-space background */}
        <color attach="background" args={['#0b0612']} />
        {/* Fog culls distant geometry early — performance + depth effect */}
        <fog   attach="fog"        args={['#0b0612', 20, 50]} />

        {/* Lighting */}
        <PastelLights />

        {/* Geometry */}
        {SHAPES.map((s, i) => (
          <Shape key={i} {...s} />
        ))}

        {/* Ambient star field */}
        <ParticleField />

        {/* Scroll-driven camera movement */}
        <CameraRig />

        {/* HDRI environment for physically correct reflections */}
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
