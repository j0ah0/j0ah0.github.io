import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, Billboard, Text } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

const FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff'

// Real post data, injected by the Jekyll page before this bundle loads.
// Shape: { slug, title, date, thumbnail, season, href }[]
const ITEMS = window.__LOG_ITEMS__ || []

const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter']

// Vertical offset per season group, giving the ring a staircase look.
const SEASON_OFFSET = { spring: 0, summer: 0.4, autumn: 0, winter: -0.4 }

// The original demo packed cards at a fixed density (Math.round(len * 22))
// and only rendered amount - 3 of those slots, leaving a gap of ~3 empty
// card-widths at the end of every category's arc. Real post counts drive
// `len` here instead, and cards were spread across the *entire* arc with
// no reserved gap — so seasons ran straight into each other. Reserve a
// fixed angular gap per season again, which also packs the real cards a
// bit closer together within their own (now slightly smaller) span.
const SEASON_GAP = 0.21 // ~2 card-widths' worth, down from ~3

// Rotation input tuning, shared between the input-listener effect and the
// per-frame momentum/damping in useFrame below.
const WHEEL_SPEED = 0.0018
const TOUCH_SPEED = 0.0035
const TOUCH_DECAY = 3.5 // higher = coasting after a flick stops sooner

function groupBySeason(items) {
  const buckets = { spring: [], summer: [], autumn: [], winter: [] }
  items.forEach((it) => {
    const s = SEASON_ORDER.includes(it.season) ? it.season : 'spring'
    buckets[s].push(it)
  })
  return buckets
}

export const App = () => {
  const [hovered, setHovered] = useState(null)
  return (
    <>
      <Canvas dpr={1} gl={{ antialias: false }} camera={{ position: [0, 4.5, 9], fov: 45 }}>
        <Scene position={[0, 1.5, 0]} onHover={setHovered} />
      </Canvas>
      <HoverPreview item={hovered} />
    </>
  )
}

// Fixed top-right overlay (plain DOM, outside the WebGL canvas) showing the
// hovered post's photo/title — replaces the old in-scene ActiveCard. Cross-
// fades to the new item instead of swapping instantly.
function HoverPreview({ item }) {
  const [displayItem, setDisplayItem] = useState(item)
  const [visible, setVisible] = useState(!!item)

  useEffect(() => {
    if (item === displayItem) return
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayItem(item)
      setVisible(!!item)
    }, 200)
    return () => clearTimeout(t)
  }, [item, displayItem])

  if (!displayItem) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 28,
        zIndex: 500,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div style={{ width: 112, height: 80, overflow: 'hidden', background: '#f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
        <img
          src={displayItem.thumbnail}
          alt={displayItem.title}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em', color: '#1f2937' }}>
        {displayItem.title}
      </p>
    </div>
  )
}

function Scene({ children, onHover, ...props }) {
  const ref = useRef()
  const frameCount = useRef(0)

  // Rotation is one unbounded float driven directly by wheel/touch input,
  // instead of ScrollControls' scrollable-div + 0..1 offset model with a
  // manual "teleport scrollTop back to the middle" wraparound hack. That
  // hack (see git history) was itself a workaround for drei's built-in
  // `infinite` getting stuck on a fast/momentum scroll, but the teleport is
  // a real discontinuity every time the ring crossed a season boundary —
  // exactly the stutter being chased. A plain accumulating value has no
  // wrap point at all, so there is nothing to teleport past.
  const targetRotation = useRef(0)
  const rotation = useRef({ value: 0 })
  const isTouching = useRef(false)
  const touchVelocity = useRef(0) // rad/sec, for a bit of coast-to-stop after lifting a finger

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      targetRotation.current += e.deltaY * WHEEL_SPEED
    }
    let touchY = null
    let lastTouchTime = 0
    const onTouchStart = (e) => {
      isTouching.current = true
      touchVelocity.current = 0
      touchY = e.touches[0].clientY
      lastTouchTime = performance.now()
    }
    const onTouchMove = (e) => {
      if (touchY === null) return
      const y = e.touches[0].clientY
      const now = performance.now()
      const dt = Math.max(now - lastTouchTime, 1) / 1000
      const dy = touchY - y
      const delta = dy * TOUCH_SPEED
      targetRotation.current += delta
      touchVelocity.current = delta / dt
      touchY = y
      lastTouchTime = now
    }
    const onTouchEnd = () => {
      isTouching.current = false
      touchY = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const buckets = useMemo(() => groupBySeason(ITEMS), [])
  // Every season gets at least a sliver of the ring, so its label always shows
  // even before any posts are tagged with it.
  const weights = SEASON_ORDER.map((season) => Math.max(buckets[season].length, 1))
  const weightTotal = weights.reduce((a, b) => a + b, 0)

  useFrame((state, delta) => {
    // Coast briefly after a touch flick, the way native momentum scrolling
    // would have — a raw touchmove listener has no such thing on its own
    // since there's no real scrollable element generating the follow-up
    // events for us.
    if (!isTouching.current && Math.abs(touchVelocity.current) > 0.001) {
      targetRotation.current += touchVelocity.current * delta
      touchVelocity.current *= Math.max(0, 1 - delta * TOUCH_DECAY)
    }
    easing.damp(rotation.current, 'value', targetRotation.current, 0.15, delta)
    ref.current.rotation.y = -rotation.current.value // Rotate contents
    // Raycasting all ~80 cards is real per-frame cost; every other frame is
    // still responsive enough for hover-while-rotating and halves that cost.
    frameCount.current++
    if (frameCount.current % 2 === 0) state.events.update()
    // On a narrow/portrait viewport the same vertical FOV shows a much
    // narrower horizontal slice, so the wide ring gets clipped on the sides.
    // The framing was tuned against a typical wide desktop window (~1.3
    // aspect), so pull the camera back proportionally any time the viewport
    // is narrower than that reference, not just when it's taller than wide.
    const REFERENCE_ASPECT = 1.3
    const aspect = state.size.width / state.size.height
    const distScale = aspect < REFERENCE_ASPECT ? REFERENCE_ASPECT / aspect : 1
    // Vertical sensitivity back down near the original demo's (2, not 3.5)
    // — moving the mouse to the bottom of the screen was dropping the
    // camera position too low / too close to the ring's underside.
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 3.5 * distScale, (state.pointer.y * 2 + 4.5) * distScale, 15 * distScale],
      0.15,
      delta
    )
    state.camera.lookAt(0, 0, 0)
  })

  let from = 0
  const groups = SEASON_ORDER.map((season, i) => {
    const data = buckets[season]
    const len = (weights[i] / weightTotal) * Math.PI * 2
    const el = (
      <Cards
        key={season}
        category={season}
        data={data}
        from={from}
        len={len}
        position={[0, SEASON_OFFSET[season], 0]}
        onPointerOver={onHover}
        onPointerOut={onHover}
      />
    )
    from += len
    return el
  })

  return (
    <group ref={ref} {...props}>
      {groups}
    </group>
  )
}

function Cards({ category, data, from = 0, len = Math.PI * 2, radius = 5.25, onPointerOver, onPointerOut, ...props }) {
  const [hovered, hover] = useState(null)
  const textRef = useRef()
  const amount = data.length
  const textPosition = from + len / 2
  // Keep at least half the arc usable even for a tiny/short category.
  const usableLen = Math.max(len - SEASON_GAP, len * 0.5)

  useFrame((state, delta) => {
    easing.damp(textRef.current.position, 'y', hovered !== null ? -0.5 : 0.5, 0.2, delta)
  })

  return (
    <group {...props}>
      <Billboard ref={textRef} position={[Math.sin(textPosition) * radius * 1.55, 0.5, Math.cos(textPosition) * radius * 1.55]}>
        <Text font={FONT_URL} fontSize={0.25} anchorX="center" color="black">
          {category}
        </Text>
      </Billboard>
      {data.map((item, i) => {
        const angle = from + (i / amount) * usableLen
        return (
          <Card
            key={item.slug}
            item={item}
            onPointerOver={(e) => (e.stopPropagation(), hover(i), onPointerOver(item), window.setCursorPointer && window.setCursorPointer(true))}
            onPointerOut={() => (hover(null), onPointerOut(null), window.setCursorPointer && window.setCursorPointer(false))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            hovered={hovered === i}
          />
        )
      })}
    </group>
  )
}

function Card({ item, hovered, onPointerOver, onPointerOut, ...props }) {
  const ref = useRef()
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : 1
    // Local -X is the group's outward radial direction (the group is already
    // rotated to face the ring center), so this pops the card away from the
    // center on hover instead of lifting it straight up.
    easing.damp3(ref.current.position, [hovered ? -1 : 0, 0, 0], 0.1, delta)
    easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta)
  })
  return (
    <group
      {...props}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={(e) => (e.stopPropagation(), item.href && item.href !== '#' && (window.location.href = item.href))}
    >
      <Image ref={ref} transparent radius={0.075} url={item.thumbnail} scale={[1.618, 1, 1]} side={THREE.DoubleSide} />
    </group>
  )
}
