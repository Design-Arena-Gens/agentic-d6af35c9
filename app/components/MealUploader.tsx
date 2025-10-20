'use client'

import { useState, useRef } from 'react'
import { Meal } from '../page'

interface Props {
  onMealAnalyzed: (meal: Meal) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function MealUploader({ onMealAnalyzed, isLoading, setIsLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mealType, setMealType] = useState('lunch')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!preview) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: preview,
          mealType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze meal')
      }

      const data = await response.json()

      const meal: Meal = {
        id: Date.now().toString(),
        timestamp: new Date(),
        foods: data.foods,
        totalProtein: data.totalProtein,
        imageUrl: preview,
        mealType,
      }

      onMealAnalyzed(meal)
      setPreview(null)
      setError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError('Failed to analyze meal. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📸 Upload Meal Photo</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Meal preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!preview || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Meal'}
        </button>
      </div>
    </div>
  )
}
