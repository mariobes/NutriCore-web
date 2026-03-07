export interface Food {
	id?: number
	userId: number
	name: string
	image?: string
	unitOfMeasurement: number
	measurementQuantity: number
	kilocalories: number
	fats: number
	carbohydrates: number
	proteins: number
	fiber: number
	sugar: number
	salt: number
}