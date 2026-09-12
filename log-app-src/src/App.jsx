import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

const FONT_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff'

// Real post data, injected by the Jekyll page before this bundle loads.
// Shape: { slug, title, date, thumbnail, season, href }[]
const ITEMS = window.__LOG_ITEMS__ || []

const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter']

// Vertical offset per season group, giving the ring a staircase look.
const SEASON_OFFSET = { spring: 0, summer: 0.4, autumn: 0, winter: -0.4 }

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
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.5, 9], fov: 45 }}>
        <ScrollControls pages={4} infinite damping={0.1}>
          <Scene position={[0, 1.5, 0]} onHover={setHovered} />
        </ScrollControls>
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
  const scroll = useScroll()

  // ScrollControls' infinite wrap starts 1px from the edge, so a single
  // scroll-up right after load instantly triggers the wrap-to-the-other-end
  // logic (looks like scrolling does nothing). Recenter it once mounted so
  // there's room to scroll either way before that kicks in. Deferred to the
  // next frame because ScrollControls (the parent) sets up `el` — appends it
  // to the DOM, sizes its scrollable content, sets its own initial scrollTop
  // — in its own effect, which fires *after* this one (child effects run
  // before parent effects), so el.scrollHeight is still 0 here otherwise.
  useEffect(() => {
    const el = scroll.el
    if (!el) return
    const raf = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight / 2
    })
    return () => cancelAnimationFrame(raf)
  }, [scroll.el])

  const buckets = useMemo(() => groupBySeason(ITEMS), [])
  // Every season gets at least a sliver of the ring, so its label always shows
  // even before any posts are tagged with it.
  const weights = SEASON_ORDER.map((season) => Math.max(buckets[season].length, 1))
  const weightTotal = weights.reduce((a, b) => a + b, 0)

  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 3.5, state.pointer.y * 3.5 + 4.5, 15], 0.15, delta)
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
        const angle = from + (i / amount) * len
        return (
          <Card
            key={item.slug}
            item={item}
            onPointerOver={(e) => (e.stopPropagation(), hover(i), onPointerOver(item), window.setCursorPointer && window.setCursorPointer(true))}
            onPointerOut={() => (hover(null), onPointerOut(null), window.setCursorPointer && window.setCursorPointer(false))}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
          />
        )
      })}
    </group>
  )
}

function Card({ item, active, hovered, onPointerOver, onPointerOut, ...props }) {
  const ref = useRef()
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1
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
