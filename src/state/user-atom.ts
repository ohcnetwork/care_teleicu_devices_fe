import { UserBase } from "@/lib/types/common";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export const userAtom = atomWithStorage<UserBase | undefined>(
  "care-auth-user",
  undefined,
  createJSONStorage(() => sessionStorage)
);
