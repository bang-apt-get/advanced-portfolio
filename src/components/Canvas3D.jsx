import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'

function FloatingShape({ position, color }) {
    const mesh = useRef()

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2
        mesh.current.rotation.y += delta * 0.3
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={mesh} position={position}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={color} wireframe />
            </mesh>
        </Float>
    )
}

function WireframeSpaceship() {
    const group = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.position.y = Math.sin(t) * 0.5
        group.current.rotation.z = Math.sin(t * 0.5) * 0.1
        group.current.rotation.x = Math.sin(t * 0.2) * 0.1
    })

    return (
        <group ref={group} position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={0.8}>
            {/* Main Body - Wireframe Cone */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[1, 4, 6]} /> {/* Reduced segments for wireframe look */}
                <meshStandardMaterial color="#a855f7" wireframe />
            </mesh>

            {/* Wings - Wireframe Tetrahedrons */}
            <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
                <tetrahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color="#ec4899" wireframe />
            </mesh>

            {/* Engine - Wireframe Ring */}
            <mesh position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.6, 0.1, 4, 8]} />
                <meshStandardMaterial color="#6366f1" wireframe />
            </mesh>
        </group>
    )
}

const Canvas3D = ({ variant = "shapes" }) => {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {variant === "shapes" ? (
                    <>
                        <FloatingShape position={[-3, 2, 0]} color="#a855f7" />
                        <FloatingShape position={[3, -2, 0]} color="#ec4899" />
                        <FloatingShape position={[0, 0, -2]} color="#6366f1" />
                    </>
                ) : (
                    <WireframeSpaceship />
                )}
            </Canvas>
        </div>
    )
}

export default Canvas3D
