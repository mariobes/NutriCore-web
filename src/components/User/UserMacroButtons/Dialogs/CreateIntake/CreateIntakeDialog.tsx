import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Divider, List, ListItem, ListItemText, Tabs, Tab } from "@mui/material";
import type { Food } from "@/core/food";
import type { Meal, MealIngredient } from "@/core/meal";
import type { Intake } from "@/core/intake";
import { useAuthStore } from "@/stores/authStore";
import { useFoodStore } from "@/stores/foodStore";
import { useMealStore } from "@/stores/mealStore";
import { useIntakeStore } from "@/stores/intakeStore";

type Tab = "food" | "meal";

const round = (n: number) => Math.round(n * 100) / 100;
const roundInt = (n: number) => Math.round(n);

export default function CreateIntakeDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
	const { getUserId } = useAuthStore();
  const { foods, fetchUserFoods, searchFood } = useFoodStore();
  const { meals, fetchUserMeals, searchMeal } = useMealStore();
	const { createIntake, fetchUserIntakes } = useIntakeStore();
	
  const [tab, setTab] = useState<Tab>("food");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
	const [editableIngredients, setEditableIngredients] = useState<MealIngredient[]>([]);
  const [quantity, setQuantity] = useState<number>(10);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
    const loadFoods = async () => {
      await fetchUserFoods(getUserId());
      const userFoods = useFoodStore.getState().foods ?? [];

      await fetchUserFoods(1);
      const defaultFoods = useFoodStore.getState().foods ?? [];

      const combined = [...userFoods, ...defaultFoods];

      useFoodStore.getState().setFoods(combined);
    };

		const loadMeals = async () => {
      await fetchUserMeals(getUserId());
      const userMeals = useMealStore.getState().meals ?? [];

      await fetchUserMeals(1);
      const defaultMeals = useMealStore.getState().meals ?? [];

      const combined = [...userMeals, ...defaultMeals];

      useMealStore.getState().setMeals(combined);
    };

    if (open)
		{
			loadFoods();
			loadMeals();
		}
  }, [open]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (tab === "food") {
			if (query.trim() === "") {
				await fetchUserFoods(getUserId());
				const defaultFoods = useFoodStore.getState().foods ?? [];
				await fetchUserFoods(1);
				const userFoods = useFoodStore.getState().foods ?? [];
				useFoodStore.getState().setFoods([...defaultFoods, ...userFoods]);
			} else {
				await searchFood(getUserId(), query);
			}
    } 
		else {
			if (query.trim() === "") {
				await fetchUserMeals(getUserId());
				const defaultMeals = useMealStore.getState().meals ?? [];
				await fetchUserMeals(1);
				const userMeals = useMealStore.getState().meals ?? [];
				useMealStore.getState().setMeals([...defaultMeals, ...userMeals]);
			} else {
				await searchMeal(getUserId(), query);
			}
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSelectedMeal(null);
    setQuantity(10);
  };

  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedFood(null);
    setQuantity(0);
		const clonedIngredients = meal.ingredients.map(ing => ({ ...ing }));
		setEditableIngredients(clonedIngredients);
  };

	const handleIngredientChange = (foodId: number, newQuantity: number) => {
		setEditableIngredients(prev =>
			prev.map(ing => ing.foodId === foodId ? { ...ing, quantity: newQuantity } : ing)
		);
	};

	const handleSubmit = async () => {
		let success;

		if (tab === "food" && selectedFood) {
			const data: Intake = {
				userId: getUserId(),
				consumableId: selectedFood.id!,
				consumableType: "food",
				foodQuantity: quantity
			};
			success = await createIntake(getUserId(), data);
		} 
		else if (tab === "meal" && selectedMeal) {
			const ingredientsChanged = editableIngredients.some(ing => {
				const orig = selectedMeal.ingredients.find(o => o.foodId === ing.foodId);
				return orig && orig.quantity !== ing.quantity;
			});

			let data: Intake;

			if (!ingredientsChanged) {
				data = {
					userId: getUserId(),
					consumableId: selectedMeal.id!,
					consumableType: "meal",
					totalKilocalories: selectedMeal.totalKilocalories,
					totalFats: selectedMeal.totalFats,
					totalCarbohydrates: selectedMeal.totalCarbohydrates,
					totalProteins: selectedMeal.totalProteins,
					totalFiber: selectedMeal.totalFiber,
					totalSugar: selectedMeal.totalSugar,
					totalSalt: selectedMeal.totalSalt
				};
			} 
			else {
				let totalKilocalories = 0;
				let totalFats = 0;
				let totalCarbohydrates = 0;
				let totalProteins = 0;
				let totalFiber = 0;
				let totalSugar = 0;
				let totalSalt = 0;

				editableIngredients.forEach(ing => {
					const food = foods?.find(f => f.id === ing.foodId);
					if (!food) return;

					const multiplier = ing.quantity / food.measurementQuantity;

					totalKilocalories += food.kilocalories * multiplier;
					totalFats += food.fats * multiplier;
					totalCarbohydrates += food.carbohydrates * multiplier;
					totalProteins += food.proteins * multiplier;
					totalFiber += food.fiber * multiplier;
					totalSugar += food.sugar * multiplier;
					totalSalt += food.salt * multiplier;
				});

				data = {
					userId: getUserId(),
					consumableId: selectedMeal.id!,
					consumableType: "meal",
          totalKilocalories: roundInt(totalKilocalories),
          totalFats: round(totalFats),
          totalCarbohydrates: round(totalCarbohydrates),
          totalProteins: round(totalProteins),
          totalFiber: round(totalFiber),
          totalSugar: round(totalSugar),
          totalSalt: round(totalSalt)
				};
			}

			success = await createIntake(getUserId(), data);
		}

    if (success) {
      await fetchUserIntakes(getUserId());
      handleClose();
    }
	};

  const handleClose = () => {
		setTab("food");
    setSelectedFood(null);
    setSelectedMeal(null);
		setEditableIngredients([]);
    setQuantity(10);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
				<Box mb={2}>
					<Tabs
						value={tab}
						onChange={(_, value) => {
							setTab(value as Tab);
							setSelectedFood(null);
							setSelectedMeal(null);
							setQuantity(value === "food" ? 10 : 0);
						}}
						centered
					>
						<Tab value="food" label="Alimentos" />
						<Tab value="meal" label="Comidas" />
					</Tabs>
				</Box>

        <Box display="flex" gap={3} mt={2}>
          <Box sx={{ width: "40%", maxHeight: 400, overflowY: "auto", border: "1px solid #ddd", borderRadius: 1, p: 1 }}>
            <TextField
              label={`Buscar ${tab === "food" ? "alimentos" : "comidas"}`}
              fullWidth
              size="small"
              margin="dense"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {tab === "food" && (
              <List>
                {foods?.map((food) => {
                  const selected = selectedFood?.id === food.id;
                  return (
                    <Box
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        cursor: "pointer",
                        bgcolor: selected ? "#b1abab" : "inherit",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: selected ? "#888484" : "#b1abab" },
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={food.name}
                          secondary={food.kilocalories && `${food.kilocalories} kcal`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  );
                })}
              </List>
            )}

            {tab === "meal" && (
              <List>
                {meals?.map((meal) => {
                  const selected = selectedMeal?.id === meal.id;
                  return (
                    <Box
                      key={meal.id}
                      onClick={() => handleSelectMeal(meal)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        cursor: "pointer",
                        bgcolor: selected ? "#b1abab" : "inherit",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: selected ? "#888484" : "#b1abab" },
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={meal.name}
                          secondary={`${meal.totalKilocalories} kcal`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>

          <Box flex={1}>
						<DialogTitle>{tab === 'food' ? 'Registrar un alimento' : 'Registrar una comida'}</DialogTitle>

            {tab === "food" && selectedFood && (
              <Box>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  sx={{ width: 120 }}
                />
              </Box>
            )}

						{tab === "meal" && selectedMeal && (
							<Box>
								{editableIngredients.map((ing) => {
									const food = foods?.find(f => f.id === ing.foodId);
									return (
										<Box key={ing.foodId} display="flex" alignItems="center" gap={2} mb={1}>
											<Box>{food?.name || "Ingrediente"}:</Box>
											<TextField
												type="number"
												value={ing.quantity}
												onChange={(e) => handleIngredientChange(ing.foodId, Number(e.target.value))}
												sx={{ width: 100 }}
											/>
										</Box>
									);
								})}
							</Box>
						)}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!selectedFood && !selectedMeal}>
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}