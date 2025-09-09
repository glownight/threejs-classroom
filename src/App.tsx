import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, StatsGl } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} castShadow receiveShadow>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.8]} />
        <meshStandardMaterial color={0xb08968} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.4, 0.7, 0.8]} />
        <meshStandardMaterial color={0x8d6b4f} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function Student({ position, phase }: { position: [number, number, number]; phase: number }) {
  const headRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (headRef.current) headRef.current.rotation.x = Math.sin(clock.getElapsedTime() + phase) * 0.05
  })
  return (
    <group position={position} castShadow>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color={0x2a9d8f} />
      </mesh>
      <mesh position={[0, 1.5, 0]} ref={headRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={0xffd7b5} />
      </mesh>
      {/* 手臂 */}
      <mesh position={[-0.35, 0.9, -0.1]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={0x2a9d8f} />
      </mesh>
      <mesh position={[0.35, 0.9, -0.1]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={0x2a9d8f} />
      </mesh>
    </group>
  )
}

function Classroom() {
  // 构建与 main.ts 相同的三维场景结构
  return (
    <>
      {/* 灯光 */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* 房间 */}
      <group>
        {/* 地板 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 14]} />
          <meshStandardMaterial color={0x8b8b8b} roughness={0.9} metalness={0} />
        </mesh>
        {/* 后墙 */}
        <mesh position={[0, 3, -7]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color={0xf0f0f0} />
        </mesh>
        {/* 左墙 */}
        <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[14, 6]} />
          <meshStandardMaterial color={0xf0f0f0} />
        </mesh>
        {/* 右墙 */}
        <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[14, 6]} />
          <meshStandardMaterial color={0xf0f0f0} />
        </mesh>
        {/* 天花板 */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
          <planeGeometry args={[20, 14]} />
          <meshStandardMaterial color={0xdddddd} />
        </mesh>
      </group>

      {/* 黑板 */}
      <mesh position={[0, 2.2, -6.95]} castShadow>
        <boxGeometry args={[8, 2.5, 0.1]} />
        <meshStandardMaterial color={0x113a2d} />
      </mesh>

      {/* 讲台 */}
      <mesh position={[0, 0.5, -4.5]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={0x9c6b3f} />
      </mesh>

      {/* 老师 */}
      <group position={[0, 0, -5.2]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.9, 1.6, 0.5]} />
          <meshStandardMaterial color={0x3456d1} />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={0xffcc99} />
        </mesh>
      </group>

      {/* 学生与课桌：3排4列 */}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => {
          const x = -4.5 + c * 3
          const z = 2 + r * 3
          const phase = r * 4 + c
          return (
            <>
              <Desk key={`desk-${r}-${c}`} position={[x, 0, z]} />
              <Student key={`student-${r}-${c}`} position={[x, 0, z - 0.6]} phase={phase} />
            </>
          )
        })
      )}
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
      style={{ width: '100%', height: '100%' }}
    >
      <Classroom />
      <OrbitControls target={[0, 1.5, -5]} />
      <StatsGl />
    </Canvas>
  )
}