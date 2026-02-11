import { create } from "zustand";
import type { Intake } from "@/core/intake";
import { createIntake, getUserIntakes } from "@/services/intakeService";

interface IntakeState {
	intake: Intake | null;
  intakes: Intake[] | null;

	setIntake: (intake: Intake) => void;
  clearIntake: () => void;
  setIntakes: (intake: Intake[]) => void;
  clearIntakes: () => void;

	createIntake: (id: number) => Promise<boolean>;
  fetchUserIntakes: (id: number) => Promise<boolean>;
}

export const useIntakeStore = create<IntakeState>((set, get) => ({
	intake: null,
	intakes: null,

	setIntake: (intake) => set({ intake }),
	clearIntake: () => set({ intake: null }),
	setIntakes: (intakes) => set({ intakes }),
	clearIntakes: () => set({ intakes: null }),

	createIntake: async (id) => {
		try {
			const intake = await createIntake(id);
			get().setIntake(intake.data);
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