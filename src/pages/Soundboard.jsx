import { motion } from 'framer-motion'
import { useRef } from 'react'

const sounds = [
    { id: 1, name: 'Synth Zap', color: 'from-pink-500 to-rose-500', play: (ctx) => playOscillator(ctx, 'sawtooth', 440, 0.1) },
    { id: 2, name: 'Deep Bass', color: 'from-blue-600 to-indigo-600', play: (ctx) => playOscillator(ctx, 'sine', 65.41, 0.5) },
    { id: 3, name: 'High Pluck', color: 'from-emerald-400 to-cyan-500', play: (ctx) => playOscillator(ctx, 'square', 880, 0.05) },
    { id: 4, name: 'Retro Coin', color: 'from-yellow-400 to-orange-500', play: (ctx) => playCoin(ctx) },
    { id: 5, name: 'Laser', color: 'from-red-500 to-pink-600', play: (ctx) => playLaser(ctx) },
    { id: 6, name: 'Kick Drum', color: 'from-gray-700 to-gray-900', play: (ctx) => playKick(ctx) },
    { id: 7, name: 'Snare', color: 'from-gray-400 to-gray-600', play: (ctx) => playSnare(ctx) },
    { id: 8, name: 'Chime', color: 'from-purple-400 to-indigo-400', play: (ctx) => playChime(ctx) },
    { id: 9, name: 'Error Buzz', color: 'from-red-600 to-red-800', play: (ctx) => playOscillator(ctx, 'sawtooth', 100, 0.3) },
]

function playOscillator(ctx, type, freq, duration) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
}

function playCoin(ctx) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(987.77, ctx.currentTime)
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
}

function playLaser(ctx) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
}

function playKick(ctx) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    gain.gain.setValueAtTime(1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
}

function playSnare(ctx) {
    const bufferSize = ctx.sampleRate * 0.2 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.value = 1000
    noise.connect(noiseFilter)
    
    const noiseEnvelope = ctx.createGain()
    noiseFilter.connect(noiseEnvelope)
    noiseEnvelope.connect(ctx.destination)
    noiseEnvelope.gain.setValueAtTime(1, ctx.currentTime)
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    noise.start()
}

function playChime(ctx) {
    const freqs = [523.25, 659.25, 783.99, 1046.50]
    freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, ctx.currentTime + (idx * 0.05))
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx * 0.05) + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + (idx * 0.05))
        osc.stop(ctx.currentTime + (idx * 0.05) + 0.5)
    })
}

const Soundboard = () => {
    const audioCtxRef = useRef(null)

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
        }
    }

    const handlePlay = (playFn) => {
        initAudio()
        playFn(audioCtxRef.current)
    }

    return (
        <div className="min-h-screen pt-32 px-4 md:px-8 bg-[#111]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto pb-32"
            >
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
                        Soundboard
                    </h1>
                    <p className="text-gray-400 text-lg">Click the pads below to generate Web Audio API procedural sounds.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {sounds.map((sound) => (
                        <motion.button
                            key={sound.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePlay(sound.play)}
                            className={`relative aspect-square rounded-2xl bg-gradient-to-br ${sound.color} p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden group`}
                        >
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center border border-white/10 rounded-2xl group-hover:border-white/30 transition-colors">
                                <span className="relative z-10 text-white font-bold text-xl tracking-wider uppercase drop-shadow-md">
                                    {sound.name}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default Soundboard
