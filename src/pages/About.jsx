import { motion } from 'framer-motion'
import Canvas3D from '../components/Canvas3D'
import MealPlanner from '../components/MealPlanner'

const About = () => {
    return (
        <div className="min-h-screen pt-32 px-4 md:px-8 relative overflow-y-auto">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <Canvas3D />
            </div>
            
            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full text-center mb-12"
                >
                    <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Fit Tracker App</h2>
                    <p className="mt-4 text-gray-400 text-lg">Plan your weekly meals and track your macros automatically.</p>
                </motion.div>
                
                <MealPlanner />
            </div>
        </div>
    )
}

export default About
