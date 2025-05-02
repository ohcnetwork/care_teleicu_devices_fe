import { atomWithStorage, createJSONStorage } from "jotai/utils";

export interface UserState {
  username?: string;
}

export const userAtom = atomWithStorage<UserState>(
  "user-atom",
  {},
  createJSONStorage(() => sessionStorage)
);
