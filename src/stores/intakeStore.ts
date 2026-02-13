import { create } from "zustand";
import type { Intake } from "@/core/intake";
import { createIntake, getUserIntakes } from "@/services/intakeService";

interface IntakeState {
	intake: Intake | null;
  intakes: Intake[] | null;

	setIntake: (intake: Intake) => void;
  clearIntake: () => void;
  setIntakes: (intakes: Intake[]) => void;
  clearIntakes: () => void;

	createIntake: (id: number, data: Intake) => Promise<boolean>;
  fetchUserIntakes: (id: number) => Promise<boolean>;
}

export const useIntakeStore = create<IntakeState>((set, get) => ({
	intake: null,
	intakes: null,

	setIntake: (intake) => set({ intake }),
	clearIntake: () => set({ intake: null }),
	setIntakes: (intakes) => set({ intakes }),
	clearIntakes: () => set({ intakes: null }),

	createIntake: async (id, data) => {
		try {
			const res = await createIntake(id, data);
			get().setIntake(res.data);
			return true;
		} catch {
			return false;
		}
	},

	fetchUserIntakes: async (id) => {
		try {
			const res = await getUserIntakes(id);
			get().setIntakes(res.data);
			return true;
		} catch {
			return false;
		}
	}
}));