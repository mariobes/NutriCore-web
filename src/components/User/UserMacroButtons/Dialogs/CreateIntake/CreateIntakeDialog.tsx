import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Divider, List, ListItem, ListItemText, Tabs, Tab, ListItemAvatar, Avatar } from "@mui/material";
import styles from "./CreateIntakeDialog.module.css";
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
  const [quantity, setQuantity] = useState("");
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

  const getDefaultQuantity = (unit: string) => {
    switch (unit) {
      case "g":
      case "ml":
        return "10";
      case "l":
      case "ud":
        return "1";
      default:
        return "1";
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSelectedMeal(null);
    setQuantity(getDefaultQuantity(food.unitOfMeasurement.toString()));
  };

  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedFood(null);
    setQuantity("");
		const clonedIngredients = meal.ingredients.map(ing => ({ ...ing }));
		setEditableIngredients(clonedIngredients);
  };

  const handleIngredientChange = (foodId: number, newQuantity: string) => {
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
				foodQuantity: Number(quantity)
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

					const multiplier = Number(ing.quantity) / food.measurementQuantity;

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
    setQuantity("10");
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" slotProps={{ paper: { sx: { width: 1000, borderRadius: "24px", m: 1 }}}}>
      <DialogContent className={styles['container-dialog']}>
        <Box className={styles['dialog-search']}>
          <Box
            className={styles['no-scrollbar']} 
            sx={{ 
              width: "50%", 
              height: 500, 
              overflowY: "auto", 
              border: "1px solid #757575",
              borderRadius: 1, 
              p: 1 }}
          >
            <TextField
              label="Buscar"
              fullWidth
              size="small"
              margin="dense"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {tab === "food" && (
              <List>
                {foods?.map((food) => {
                  const isSelected = selectedFood?.id === food.id;
                  return (
                    <Box
                      className={styles['dialog-box']}
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        alignItems: "center",
                        cursor: "pointer",
                        bgcolor: isSelected ? "#b1abab" : "inherit",
                        transition: "background-color 0.2s, color 0.2s",
                        "&:hover": {
                          bgcolor: isSelected ? "#888484" : "#b1abab",
                        }
                      }}
                    >
                      <ListItemAvatar >
                        <Avatar
                          src={food.image || "/images/default-food-meal.png"}
                          alt={food.name}
                          className={styles['dialog-image']}
                        />
                      </ListItemAvatar>
                      <ListItem className={styles['dialog-text']}>
                        <ListItemText
                          primary={food.name}
                        />
                        <ListItemText
                          secondary={`${food.kilocalories} Kcal | ${food.proteins} P | ${food.carbohydrates} C | ${food.fats} G`}
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
                  const isSelected = selectedMeal?.id === meal.id;
                  return (
                    <Box
                      className={styles['dialog-box']}
                      key={meal.id}
                      onClick={() => handleSelectMeal(meal)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        alignItems: "center",
                        cursor: "pointer",
                        bgcolor: isSelected ? "#b1abab" : "inherit",
                        transition: "background-color 0.2s, color 0.2s",
                        "&:hover": {
                          bgcolor: isSelected ? "#888484" : "#b1abab",
                        }
                      }}
                    >
                      <ListItemAvatar >
                        <Avatar
                          src={meal.image || "/images/default-food-meal.png"}
                          alt={meal.name}
                          className={styles['dialog-image']}
                        />
                      </ListItemAvatar>
                      <ListItem className={styles['dialog-text']}>
                        <ListItemText
                          primary={meal.name}
                        />
                        <ListItemText
                          secondary={`${meal.totalKilocalories} Kcal | ${meal.totalProteins} P | ${meal.totalCarbohydrates} C | ${meal.totalFats} G`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>

          <Box flex={1} className={styles['no-scrollbar']} sx={{ maxHeight: 450, overflowY: "auto" }}>
            <Box mb={2}>
              <Tabs
                value={tab}
                onChange={(_, value) => {
                  setTab(value as Tab);
                  setSelectedFood(null);
                  setSelectedMeal(null);
                }}
                centered
                sx={{
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.75rem", sm: "0.9rem" },
                    minWidth: { xs: 60, sm: 120 },
                    padding: { xs: "4px 10px", sm: "6px 16px" },
                  }
                }}
              >
                <Tab className={styles['tab-text']} value="food" label="Alimentos" />
                <Tab className={styles['tab-text']} value="meal" label="Comidas" />
              </Tabs>
            </Box>

						<DialogTitle className={styles['form-title']}>
              {tab === 'food' ? 'Registrar un alimento' : 'Registrar una comida'}
            </DialogTitle>

            {tab === "food" && selectedFood && (
              <Box className={styles['form-content']}>
                <ListItemAvatar >
                  <Avatar
                    src={selectedFood.image || "/images/default-food-meal.png"}
                    alt={selectedFood.name}
                    className={styles['form-food-image']}
                  />
                </ListItemAvatar>
                <Box className={styles['form-food-name']}>
                  {selectedFood.name}
                </Box>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  sx={{ width: '55px', minWidth: '55px' }}
                />
                <Box sx={{ minWidth: '30px' }}><b>{selectedFood.unitOfMeasurement}</b></Box>
              </Box>
            )}

						{tab === "meal" && selectedMeal && (
							<Box>
								{editableIngredients.map((ing) => {
									const food = foods?.find(f => f.id === ing.foodId);
									return (
										<Box 
                      className={styles['form-content']}
                      key={ing.foodId}
                    >
                      <ListItemAvatar >
                        <Avatar
                          src={food?.image || "/images/default-food-meal.png"}
                          alt={food?.name}
                          className={styles['form-food-image']}
                        />
                      </ListItemAvatar>
											<Box className={styles['form-food-name']}>
                        {food?.name}
                      </Box>
											<TextField
												type="number"
												value={ing.quantity}
												onChange={(e) => handleIngredientChange(ing.foodId, e.target.value)}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
												sx={{ width: '55px', minWidth: '55px' }}
											/>
                      <Box sx={{ minWidth: '30px' }}><b>{food?.unitOfMeasurement}</b></Box>
										</Box>
									);
								})}
							</Box>
						)}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={styles['dialog-buttons']}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={
            (!selectedFood && !selectedMeal) ||
            (selectedFood && (!quantity || Number(quantity) <= 0)) ||
            (selectedMeal && editableIngredients.some(ing => !ing.quantity || Number(ing.quantity) <= 0)) || 
            false
          }
        >
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}