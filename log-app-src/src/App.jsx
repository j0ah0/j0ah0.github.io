import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'
import { suspend } from 'suspend-react'
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

export const App = () => (
  <Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.5, 9], fov: 45 }}>
    <ScrollControls pages={4} infinite>
      <Scene position={[0, 1.5, 0]} />
    </ScrollControls>
  </Canvas>
)

function Scene({ children, ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const [hovered, hover] = useState(null)

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
        onPointerOver={hover}
        onPointerOut={hover}
      />
    )
    from += len
    return el
  })

  return (
    <group ref={ref} {...props}>
      {groups}
      <ActiveCard hovered={hovered} />
    </group>
  )
}

function Cards({ category, data, from = 0, len = Math.PI * 2, radius = 5.25, onPointerOver, onPointerOut, ...props }) {
  const [hovered, hover] = useState(null)
  const amount = data.length
  const textPosition = from + len / 2
  return (
    <group {...props}>
      <Billboard position={[Math.sin(textPosition) * radius * 1.55, 0.1, Math.cos(textPosition) * radius * 1.55]}>
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
            onPointerOver={(e) => (e.stopPropagation(), hover(i), onPointerOver(item))}
            onPointerOut={() => (hover(null), onPointerOut(null))}
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

function ActiveCard({ hovered, ...props }) {
  const ref = useRef()
  // Starts invisible so no thumbnail flashes on load before anything is hovered.
  useLayoutEffect(() => void (ref.current.material.opacity = 0), [])
  useLayoutEffect(() => void (ref.current.material.zoom = 0.8), [hovered])
  useFrame((state, delta) => {
    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', hovered !== null, 0.3, delta)
  })
  return (
    <Billboard {...props}>
      <Text font={FONT_URL} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
        {hovered !== null && `${hovered.title}\n${hovered.date || ''}`}
      </Text>
      <Image
        ref={ref}
        transparent
        radius={0.3}
        position={[0, 1.5, 0]}
        scale={[3.5, 1.618 * 3.5, 0.2, 1]}
        url={hovered ? hovered.thumbnail : ITEMS[0]?.thumbnail}
      />
    </Billboard>
  )
}
