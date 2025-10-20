'use client'

import { useState } from 'react'

interface Props {
  dailyGoal: number
  onGoalChange: (goal: number) => void
}

export default function GoalSetter({ dailyGoal, onGoalChange }: Props) {
  const [weight, setWeight] = useState(70)
  const [showCalculator, setShowCalculator] = useState(false)

  const calculateGoal = (activityLevel: string) => {
    let multiplier = 1.6

    switch (activityLevel) {
      case 'sedentary':
        multiplier = 1.2
        break
      case 'moderate':
        multiplier = 1.6
        break
      case 'active':
        multiplier = 2.0
        break
      case 'athlete':
        multiplier = 2.2
        break
    }

    return Math.round(weight * multiplier)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Daily Goal</h2>

      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {dailyGoal}g
        </div>
        <p className="text-gray-600 text-sm">Protein per day</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Goal (g)
          </label>
          <input
            type="number"
            value={dailyGoal}
            onChange={(e) => onGoalChange(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm"
        >
          {showCalculator ? '▼ Hide Calculator' : '▶ Calculate Based on Weight'}
        </button>

        {showCalculator && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: 'Sedentary', desc: '1.2g/kg' },
                  { value: 'moderate', label: 'Moderate', desc: '1.6g/kg' },
                  { value: 'active', label: 'Active', desc: '2.0g/kg' },
                  { value: 'athlete', label: 'Athlete', desc: '2.2g/kg' },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => onGoalChange(calculateGoal(level.value))}
                    className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="text-xs text-gray-500">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
