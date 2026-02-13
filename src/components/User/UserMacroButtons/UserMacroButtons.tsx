import { useState } from "react";
import { Box, Button } from "@mui/material";
import IconAdd from '@mui/icons-material/AddCircleOutline';
import styles from "./UserMacroButtons.module.css";
import CreateFoodDialog from "./Dialogs/CreateFood/CreateFoodDialog";
import CreateMealDialog from "./Dialogs/CreateMeal/CreateMealDialog";

export default function UserMacroButtons() {
	const [openFood, setOpenFood] = useState(false);
	const [openMeal, setOpenMeal] = useState(false);
	const [openIntake, setOpenIntake] = useState(false);
	const [openWater, setOpenWater] = useState(false);

  return (
		<Box className={styles['container-buttons']} mt={3}>
			<Button variant="contained" className={styles['container-buttons-btn']} onClick={() => setOpenFood(true)}
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Crear alimento
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} onClick={() => setOpenMeal(true)}
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Crear comida
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} onClick={() => setOpenIntake(true)}
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Añadir registro
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} onClick={() => setOpenWater(true)}
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Introducir agua 
			</Button>

			<CreateFoodDialog open={openFood} onClose={() => setOpenFood(false)} />
			<CreateMealDialog open={openMeal} onClose={() => setOpenMeal(false)} />
		  {/* <CreateIntakeDialog open={openIntake} onClose={() => setOpenIntake(false)} /> */}
		  {/* <PutWaterDialog open={openWater} onClose={() => setOpenWater(false)} /> */}
		</Box>
  );
}