export interface Meal {
	id?: number
	userId: number
	name: string
	image: string
    ingredients: MealIngredient[]
}

export interface MealIngredient {
	foodId: number
	quantity: number
}