import { motion } from 'framer-motion'
import Canvas3D from '../components/Canvas3D'

const Home = () => {
    return (
        <div className="h-screen flex items-center justify-center relative overflow-hidden">
            <Canvas3D />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                    Creative Developer
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Click next to see...
                </p>
            </motion.div>
        </div>
    )
}

export default Home
