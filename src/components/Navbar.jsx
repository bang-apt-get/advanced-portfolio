import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const links = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'Fit Tracker App' },
        { path: '/soundboard', label: 'Soundboard' },
        { path: '/contact', label: 'Contact' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-black/30">
            <div
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate('/')
                }}
                className="text-2xl font-bold text-white cursor-pointer"
            >
                J.Teerisalo
            </div>

            <ul className="flex gap-8">
                {links.map((link) => (
                    <li key={link.path} className="relative">
                        <div
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate(link.path)
                            }}
                            className={`text-sm font-medium transition-colors cursor-pointer ${location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {link.label}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-purple-500"
                                />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navbar
