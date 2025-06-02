import { LocationList } from "@/lib/types/location";

export type EncounterStatus =
  | "planned"
  | "in_progress"
  | "on_hold"
  | "discharged"
  | "completed"
  | "cancelled"
  | "discontinued"
  | "entered_in_error"
  | "unknown";

export interface Encounter {
  id: string;
  patient: {
    id: string;
    name: string;
  };
  facility: {
    id: string;
    name: string;
  };
  current_location?: LocationList;
  status: EncounterStatus;
}
