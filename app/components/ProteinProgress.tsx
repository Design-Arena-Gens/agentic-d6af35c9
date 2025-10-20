'use client'

interface Props {
  current: number
  goal: number
}

export default function ProteinProgress({ current, goal }: Props) {
  const percentage = Math.min((current / goal) * 100, 100)
  const remaining = Math.max(goal - current, 0)

  const getMessage = () => {
    if (current >= goal) {
      return "🎉 Great job! You've reached your daily protein goal!"
    } else if (current >= goal * 0.75) {
      return `💪 Almost there! Just ${remaining.toFixed(0)}g more to go!`
    } else if (current >= goal * 0.5) {
      return `👍 Good progress! ${remaining.toFixed(0)}g more protein needed today.`
    } else {
      return `🍳 You need ${remaining.toFixed(0)}g more protein to reach your goal.`
    }
  }

  const getSuggestions = () => {
    if (current >= goal) return null

    const suggestions = [
      '🥚 2 eggs (12g)',
      '🍗 Chicken breast 100g (31g)',
      '🥛 Greek yogurt 200g (20g)',
      '🥜 Peanuts 30g (8g)',
      '🧀 Paneer 100g (18g)',
      '🫘 Dal 1 cup (18g)',
      '🥤 Protein shake (25g)',
    ]

    return suggestions.slice(0, 3)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Today's Progress</h2>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-3xl font-bold text-blue-600">
            {current.toFixed(0)}g
          </span>
          <span className="text-xl text-gray-500">
            / {goal}g
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${percentage}%` }}
          >
            {percentage > 10 && (
              <span className="text-white text-sm font-semibold">
                {percentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-gray-700 font-medium">{getMessage()}</p>
      </div>

      {getSuggestions() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💡 High-protein food suggestions:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            {getSuggestions()?.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
