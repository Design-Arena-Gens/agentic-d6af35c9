'use client'

import { Meal } from '../page'

interface Props {
  meals: Meal[]
  onDeleteMeal: (id: string) => void
  onClearHistory: () => void
}

export default function MealHistory({ meals, onDeleteMeal, onClearHistory }: Props) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const groupedMeals = meals.reduce((groups, meal) => {
    const date = formatDate(meal.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(meal)
    return groups
  }, {} as Record<string, Meal[]>)

  if (meals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No meals yet</h3>
        <p className="text-gray-500">Upload a meal photo to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Meal History</h2>
        {meals.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(groupedMeals).map(([date, dateMeals]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2">
              {date}
            </h3>
            <div className="space-y-4">
              {dateMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold text-gray-800 capitalize">
                          {meal.mealType}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTime(meal.timestamp)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {meal.totalProtein.toFixed(1)}g protein
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {meal.imageUrl && (
                    <img
                      src={meal.imageUrl}
                      alt="Meal"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}

                  <div className="space-y-2">
                    {meal.foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-gray-50 rounded px-3 py-2"
                      >
                        <div>
                          <span className="font-medium text-gray-800">{food.name}</span>
                          <span className="text-gray-500 ml-2">({food.quantity})</span>
                        </div>
                        <span className="font-semibold text-blue-600">
                          {food.protein.toFixed(1)}g
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
