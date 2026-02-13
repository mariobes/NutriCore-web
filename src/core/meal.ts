export interface Meal {
	id?: number
	userId: number
	name: string
	image: string
    ingredients: MealIngredient[]
	totalKilocalories?: number
	totalFats?: number
	totalCarbohydrates?: number
	totalProteins?: number
	totalFiber?: number
	totalSugar?: number
	totalSalt?: number
}

export interface MealIngredient {
	foodId: number
	quantity: number
}