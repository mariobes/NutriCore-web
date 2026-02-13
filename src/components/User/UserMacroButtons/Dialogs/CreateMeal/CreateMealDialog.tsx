import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Divider, List, ListItem, ListItemText } from "@mui/material";
import type { Food } from "@/core/food";
import type { Meal, MealIngredient } from "@/core/meal";
import { useAuthStore } from "@/stores/authStore";
import { useFoodStore } from "@/stores/foodStore";
import { useMealStore } from "@/stores/mealStore";

export default function CreateMealModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { getUserId } = useAuthStore();
  const { foods, fetchUserFoods, searchFood } = useFoodStore();
  const { createMeal } = useMealStore();
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<{ food: Food; quantity: number }[]>([]);
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

    if (open) loadFoods();
  }, [open]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      await fetchUserFoods(getUserId());
      const defaultFoods = useFoodStore.getState().foods ?? [];
      await fetchUserFoods(1);
      const userFoods = useFoodStore.getState().foods ?? [];
      useFoodStore.getState().setFoods([...defaultFoods, ...userFoods]);
    } else {
      await searchFood(getUserId(), query);
    }
  };

  const toggleFoodSelection = (food: Food) => {
    setSelectedFoods((prev) => {
      const exists = prev.find((f) => f.food.id === food.id);
      if (exists) {
        return prev.filter((f) => f.food.id !== food.id);
      } else {
        return [...prev, { food, quantity: 10 }];
      }
    });
  };

  const handleQuantityChange = (foodId: number, value: number) => {
    setSelectedFoods((prev) =>
      prev.map((f) =>
        f.food.id === foodId ? { ...f, quantity: value } : f
      )
    );
  };

  const handleSubmit = async () => {
    const mealIngredients: MealIngredient[] = selectedFoods.map((f) => ({
      foodId: f.food.id ?? 0,
      quantity: f.quantity,
    }));

    const data: Meal = {
      userId: getUserId(),
      name,
      image,
      ingredients: mealIngredients,
    };

    const success = await createMeal(getUserId(), data);
    
    if (success) handleClose();
  };

  const handleClose = () => {
    setName("");
    setImage("");
    setSelectedFoods([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "right" }}>Crear nueva comida</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={3}>
          <Box
            sx={{
              width: "40%",
              maxHeight: 400,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 1,
            }}
          >
            <TextField
              label="Buscar alimentos"
              fullWidth
              size="small"
              margin="dense"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            <List>
              {foods?.map((food) => {
                const isSelected = selectedFoods.some(
                  (f) => f.food.id === food.id
                );
                return (
                  <Box
                    key={food.id}
                    onClick={() => toggleFoodSelection(food)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: "pointer",
                      bgcolor: isSelected ? "#b1abab" : "inherit",
                      transition: "background-color 0.2s, color 0.2s",
                      "&:hover": {
                        bgcolor: isSelected ? "#888484" : "#b1abab",
                      },
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={food.name}
                        secondary={
                          food.kilocalories && `${food.kilocalories} kcal`
                        }
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}
            </List>
          </Box>

          <Box flex={1}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Image"
              fullWidth
              margin="normal"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            {selectedFoods.map(({ food, quantity }) => (
              <Box
                key={food.id}
                display="flex"
                alignItems="center"
                gap={2}
                mt={1}
              >
                <Box>
                  Introducir cantidad de <b>{food.name}</b>
                </Box>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(food.id ?? 0, Number(e.target.value))
                  }
                  sx={{ width: 100 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}