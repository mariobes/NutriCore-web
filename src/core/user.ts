export interface User {
  id: number
  name: string
  email: string
  password: string
  age: number
  height: number
  weight: number
  country: string
  dailyWater: number
  dailyKilocalorieTarget: number
  dailyFatTarget: number
  dailyCarbohydrateTarget: number
  dailyProteinTarget: number
  dailyWaterTarget: number
  role: string
}

export interface UserCreateUpdate {
  name: string
  email: string
  password?: string
  age: number
  height: number
  weight: number
  country: string
}

export interface UserTargets {
  dailyKilocalorieTarget?: number
  dailyFatTarget?: number
  dailyCarbohydrateTarget?: number
  dailyProteinTarget?: number
  dailyWaterTarget?: number
}