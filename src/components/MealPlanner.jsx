import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, ChevronRight, Activity, Flame, Beef, Wheat } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

const initialData = DAYS.reduce((acc, day) => {
    acc[day] = MEAL_TYPES.reduce((mAcc, type) => {
        mAcc[type] = []
        return mAcc
    }, {})
    return acc
}, {})

const MealPlanner = () => {
    const [selectedDay, setSelectedDay] = useState('Mon')
    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem('fitTrackerSchedule')
        if (saved) return JSON.parse(saved)
        return initialData
    })
    
    const [modalOpen, setModalOpen] = useState(false)
    const [editingMeal, setEditingMeal] = useState(null)
    const [activeMealType, setActiveMealType] = useState('Breakfast')
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    })

    useEffect(() => {
        localStorage.setItem('fitTrackerSchedule', JSON.stringify(schedule))
    }, [schedule])

    const calculateDailyTotals = (day) => {
        let totals = { calories: 0, protein: 0, carbs: 0, fats: 0 }
        
        MEAL_TYPES.forEach(type => {
            schedule[day][type].forEach(meal => {
                totals.calories += Number(meal.calories) || 0
                totals.protein += Number(meal.protein) || 0
                totals.carbs += Number(meal.carbs) || 0
                totals.fats += Number(meal.fats) || 0
            })
        })
        return totals
    }

    const currentTotals = calculateDailyTotals(selectedDay)

    const handleOpenModal = (mealType, meal = null) => {
        setActiveMealType(mealType)
        if (meal) {
            setEditingMeal(meal.id)
            setFormData(meal)
        } else {
            setEditingMeal(null)
            setFormData({
                id: Date.now().toString(),
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: ''
            })
        }
        setModalOpen(true)
    }

    const handleSaveMeal = (e) => {
        e.preventDefault()
        setSchedule(prev => {
            const meals = [...prev[selectedDay][activeMealType]]
            
            if (editingMeal) {
                const index = meals.findIndex(m => m.id === editingMeal)
                if (index !== -1) meals[index] = formData
            } else {
                meals.push({ ...formData, id: Date.now().toString() })
            }
            
            return {
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    [activeMealType]: meals
                }
            }
        })
        setModalOpen(false)
    }

    const handleDeleteMeal = (mealType, mealId) => {
        setSchedule(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [mealType]: prev[selectedDay][mealType].filter(m => m.id !== mealId)
            }
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : Number(value)
        }))
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-32">
            
            {/* Days Navigator */}
            <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 overflow-x-auto">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                            selectedDay === day ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {selectedDay === day && (
                            <motion.div
                                layoutId="activeDay"
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/50 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{day}</span>
                    </button>
                ))}
            </div>

            {/* Daily Macro Summary */}
            <motion.div
                key={`summary-${selectedDay}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-500/30 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Flame size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-400">Calories</p>
                        <p className="text-2xl font-bold text-white">{currentTotals.calories} \`kcal\`</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Beef size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-400">Protein</p>
                        <p className="text-2xl font-bold text-white">{currentTotals.protein}g</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-orange-500/30 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><Wheat size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-400">Carbs</p>
                        <p className="text-2xl font-bold text-white">{currentTotals.carbs}g</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><Activity size={24}/></div>
                    <div>
                        <p className="text-sm text-gray-400">Fats</p>
                        <p className="text-2xl font-bold text-white">{currentTotals.fats}g</p>
                    </div>
                </div>
            </motion.div>

            {/* Meals List */}
            <div className="space-y-6">
                {MEAL_TYPES.map((type) => (
                    <motion.div 
                        key={type}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 bg-white/5 border-b border-white/5">
                            <h3 className="text-xl font-bold text-gray-200">{type}</h3>
                            <button 
                                onClick={() => handleOpenModal(type)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus size={16} /> Add Meal
                            </button>
                        </div>
                        
                        <div className="p-2">
                            {schedule[selectedDay][type].length === 0 ? (
                                <div className="p-8 text-center text-gray-500 italic">No meals added yet.</div>
                            ) : (
                                <ul className="space-y-2">
                                    <AnimatePresence>
                                        {schedule[selectedDay][type].map((meal) => (
                                            <motion.li 
                                                key={meal.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                                            >
                                                <div>
                                                    <p className="text-lg font-medium text-white">{meal.name}</p>
                                                    <p className="text-sm text-gray-400 mt-1 flex gap-4">
                                                        <span>{meal.calories} kcal</span>
                                                        <span className="text-green-400/80">P: {meal.protein}g</span>
                                                        <span className="text-orange-400/80">C: {meal.carbs}g</span>
                                                        <span className="text-red-400/80">F: {meal.fats}g</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenModal(type, meal)} className="p-2 text-gray-400 hover:text-white bg-black/30 rounded-lg"><Edit2 size={16}/></button>
                                                    <button onClick={() => handleDeleteMeal(type, meal.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">{editingMeal ? 'Edit' : 'Add'} {activeMealType}</h3>
                                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
                            </div>

                            <form onSubmit={handleSaveMeal} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Meal Name</label>
                                    <input 
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="e.g. Chicken & Rice"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Calories</label>
                                        <input type="number" required name="calories" value={formData.calories} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Protein (g)</label>
                                        <input type="number" required name="protein" value={formData.protein} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Carbs (g)</label>
                                        <input type="number" required name="carbs" value={formData.carbs} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Fats (g)</label>
                                        <input type="number" required name="fats" value={formData.fats} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                    {editingMeal ? 'Save Changes' : 'Add Meal'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MealPlanner
