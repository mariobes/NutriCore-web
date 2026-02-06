import { Box, Button } from "@mui/material";
import IconAdd from '@mui/icons-material/AddCircleOutline';
import styles from "./UserMacroButtons.module.css";

export default function UserMacroButtons() {

  return (
		<Box className={styles['container-buttons']} mt={3}>
			<Button variant="contained" className={styles['container-buttons-btn']} /*onClick={handleCreateFood}*/
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Crear alimento
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} /*onClick={handleCreateMeal}*/
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Crear comida
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} /*onClick={handleAddRecord}*/
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Añadir registro
			</Button>
			<Button variant="contained" className={styles['container-buttons-btn']} /*onClick={handlePutWater}*/
				endIcon={<IconAdd style={{ fontSize: 22, marginTop: 3 }} />}>
				Introducir agua 
			</Button>
		</Box>
  );
}