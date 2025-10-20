'use client'

import { useState, useEffect } from 'react'
import MealUploader from './components/MealUploader'
import MealHistory from './components/MealHistory'
import ProteinProgress from './components/ProteinProgress'
import GoalSetter from './components/GoalSetter'

export interface FoodItem {
  name: string
  quantity: string
  protein: number
}

export interface Meal {
  id: string
  timestamp: Date
  foods: FoodItem[]
  totalProtein: number
  imageUrl?: string
  mealType?: string
}

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [dailyGoal, setDailyGoal] = useState(100)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals')
    const savedGoal = localStorage.getItem('dailyGoal')

    if (savedMeals) {
      const parsedMeals = JSON.parse(savedMeals)
      setMeals(parsedMeals.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })))
    }

    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals))
  }, [meals])

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString())
  }, [dailyGoal])

  const getTodayTotal = () => {
    const today = new Date().toDateString()
    return meals
      .filter(meal => new Date(meal.timestamp).toDateString() === today)
      .reduce((sum, meal) => sum + meal.totalProtein, 0)
  }

  const handleMealAnalyzed = (meal: Meal) => {
    setMeals(prev => [meal, ...prev])
  }

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id))
  }

  const handleClearHistory = () => {
    setMeals([])
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🍗 AI Protein Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Upload meal photos to track your daily protein intake
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <MealUploader
              onMealAnalyzed={handleMealAnalyzed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
          <div>
            <GoalSetter
              dailyGoal={dailyGoal}
              onGoalChange={setDailyGoal}
            />
          </div>
        </div>

        <ProteinProgress
          current={getTodayTotal()}
          goal={dailyGoal}
        />

        <MealHistory
          meals={meals}
          onDeleteMeal={handleDeleteMeal}
          onClearHistory={handleClearHistory}
        />
      </div>
    </main>
  )
}
