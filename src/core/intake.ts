export interface Intake {
	id: number
	userId: number
	consumableId: number
	consumableType: string
	date: Date
	foodQuantity?: number
	totalKilocalories?: number
	totalFats?: number
	totalCarbohydrates?: number
	totalProteins?: number
	totalFiber?: number
	totalSugar?: number
	totalSalt?: number
}