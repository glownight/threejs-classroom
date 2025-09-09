import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, StatsGl, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

const ROOM = { width: 20, depth: 14, height: 6 }
const GRID = { rows: 3, cols: 4, xStart: -4.5, zStart: 2, step: 3 }

function Desk({ position }: { position: [number, number, number] }) {
  const legX = 0.6
  const legZ = 0.35
  return (
    <group position={position} castShadow receiveShadow>
      {/* 桌面 */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.8]} />
        <meshStandardMaterial color={0xb08968} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* 抽屉主体 */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 0.8]} />
        <meshStandardMaterial color={0x8d6b4f} roughness={0.8} metalness={0.02} />
      </mesh>
      {/* 桌腿 */}
      {[[-legX, 0.15, -legZ], [legX, 0.15, -legZ], [-legX, 0.15, legZ], [legX, 0.15, legZ]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={0x6f4e37} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} castShadow receiveShadow>
      {/* 座面 */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.6]} />
        <meshStandardMaterial color={0x1f6f64} roughness={0.8} />
      </mesh>
      {/* 椅背 */}
      <mesh position={[0, 0.9, -0.25]}>
        <boxGeometry args={[0.7, 0.8, 0.1]} />
        <meshStandardMaterial color={0x1e5d53} roughness={0.85} />
      </mesh>
      {/* 椅腿 */}
      {[-0.3, 0.3].flatMap((x) => [-0.25, 0.25].map((z, i) => (
        <mesh key={`${x}-${z}`} position={[x, 0.25, z]} castShadow>
          <boxGeometry args={[0.06, 0.5, 0.06]} />
          <meshStandardMaterial color={0x184b44} />
        </mesh>
      )))}
    </group>
  )
}

function Student({ position, phase }: { position: [number, number, number]; phase: number }) {
  const headRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const lArmRef = useRef<THREE.Mesh>(null)
  const rArmRef = useRef<THREE.Mesh>(null)
  const raiseHand = useMemo(() => phase % 5 === 0, [phase])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (headRef.current) headRef.current.rotation.x = Math.sin(t + phase) * 0.12
    if (bodyRef.current) bodyRef.current.position.y = Math.sin(t * 1.2 + phase) * 0.02
    // 手臂动画：左手不时举起，右手轻微摆动
    if (lArmRef.current) {
      const base = -0.4
      const up = -1.25
      const k = raiseHand ? (Math.sin(t * 1.4 + phase) * 0.5 + 0.5) : 0
      lArmRef.current.rotation.x = THREE.MathUtils.lerp(base, up, k)
    }
    if (rArmRef.current) rArmRef.current.rotation.x = -0.4 + Math.sin(t * 1.6 + phase) * 0.15
  })

  return (
    <group position={position} castShadow>
      <group ref={bodyRef}>
        {/* 身体 */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.6, 1.2, 0.4]} />
          <meshStandardMaterial color={0x2a9d8f} roughness={0.85} />
        </mesh>
        {/* 头部 */}
        <mesh position={[0, 1.5, 0]} ref={headRef} castShadow>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color={0xffd7b5} roughness={0.6} />
        </mesh>
        {/* 手臂 */}
        <mesh position={[-0.35, 0.9, -0.1]} rotation={[-0.4, 0, 0]} ref={lArmRef} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={0x2a9d8f} />
        </mesh>
        <mesh position={[0.35, 0.9, -0.1]} rotation={[-0.4, 0, 0]} ref={rArmRef} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={0x2a9d8f} />
        </mesh>
      </group>
    </group>
  )
}

function Teacher() {
  const rArmRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (rArmRef.current) rArmRef.current.rotation.x = -0.3 + Math.sin(t * 1.7) * 0.35
  })
  return (
    <group position={[0, 0, -5.2]}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.9, 1.6, 0.5]} />
        <meshStandardMaterial color={0x3456d1} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.35, 20, 20]} />
        <meshStandardMaterial color={0xffcc99} />
      </mesh>
      {/* 手臂：右手挥动 */}
      <mesh position={[0.45, 1.3, -0.05]} rotation={[-0.3, 0, 0]} ref={rArmRef} castShadow>
        <boxGeometry args={[0.16, 0.7, 0.16]} />
        <meshStandardMaterial color={0x3456d1} />
      </mesh>
      {/* 左手静止 */}
      <mesh position={[-0.45, 1.3, -0.05]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.7, 0.16]} />
        <meshStandardMaterial color={0x3456d1} />
      </mesh>
    </group>
  )
}

function Blackboard() {
  return (
    <group>
      {/* 黑板主体 */}
      <mesh position={[0, 2.2, -6.95]} castShadow>
        <boxGeometry args={[8, 2.5, 0.1]} />
        <meshStandardMaterial color={0x0e2a23} roughness={0.9} />
      </mesh>
      {/* 木质边框 */}
      <mesh position={[0, 2.2, -6.99]}>
        <boxGeometry args={[8.4, 2.9, 0.02]} />
        <meshStandardMaterial color={0x5f4b32} roughness={0.85} />
      </mesh>
      {/* 粉笔槽 */}
      <mesh position={[0, 0.95, -6.92]}>
        <boxGeometry args={[8.2, 0.08, 0.2]} />
        <meshStandardMaterial color={0xb08968} />
      </mesh>
      {/* 简单“粉笔线” */}
      <mesh position={[-1.2, 2.2, -6.9]}>
        <boxGeometry args={[2.0, 0.03, 0.02]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
      <mesh position={[1.0, 1.8, -6.9]}>
        <boxGeometry args={[1.6, 0.03, 0.02]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
    </group>
  )
}

function Room() {
  return (
    <group>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={0x767676} roughness={0.95} metalness={0} />
      </mesh>
      {/* 后墙 */}
      <mesh position={[0, ROOM.height / 2, -ROOM.depth / 2]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
        <meshStandardMaterial color={0xe7e7e7} />
      </mesh>
      {/* 左右墙 */}
      <mesh position={[-ROOM.width / 2, ROOM.height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <meshStandardMaterial color={0xeaeaea} />
      </mesh>
      <mesh position={[ROOM.width / 2, ROOM.height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <meshStandardMaterial color={0xeaeaea} />
      </mesh>
      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={0xdddddd} />
      </mesh>
    </group>
  )
}

function Classroom() {
  return (
    <>
      {/* 光照：环境 + 半球 + 定向光阴影 */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={[0xbccad6, 0x404040, 0.5]} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" left={-15} right={15} top={10} bottom={-10} near={0.1} far={50} />
      </directionalLight>

      <Room />
      <Blackboard />

      {/* 讲台 */}
      <mesh position={[0, 0.5, -4.5]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={0x9c6b3f} roughness={0.8} />
      </mesh>

      <Teacher />

      {/* 学生与课桌：GRID.rows x GRID.cols */}
      {Array.from({ length: GRID.rows }).map((_, r) =>
        Array.from({ length: GRID.cols }).map((_, c) => {
          const x = GRID.xStart + c * GRID.step
          const z = GRID.zStart + r * GRID.step
          const phase = r * GRID.cols + c
          return (
            <group key={`group-${r}-${c}`}>
              <Desk position={[x, 0, z]} />
              <Chair position={[x, 0, z - 0.55]} />
              <Student position={[x, 0, z - 0.6]} phase={phase} />
            </group>
          )
        })
      )}

      {/* 软阴影接触地面 */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={30} blur={2.5} far={20} frames={1} />
    </>
  )
}

export default function App() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [8, 6, 12], fov: 60, near: 0.1, far: 1000 }}
      onCreated={({ scene, camera }) => {
        scene.background = new THREE.Color(0xbfd1e5)
        camera.lookAt(0, 1.5, -5)
      }}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Classroom />
      <OrbitControls
        target={[0, 1.5, -5]}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.6}
        maxPolarAngle={1.35}
        minDistance={8}
        maxDistance={22}
        autoRotate
        autoRotateSpeed={0.4}
      />
      <StatsGl />
    </Canvas>
  )
}