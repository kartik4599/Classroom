import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface UserInformation {
  socketId?: string;
  setSocketId: (socketId: string) => void;
  userData?: { id: number; name: string };
  setUserData: (userData: { id: number; name: string }) => void;
}

const useUserInformation = create<UserInformation>()(
  devtools(
    persist(
      (set) => ({
        setSocketId: (socketId: string) => set({ socketId }),
        setUserData: (userData: { id: number; name: string }) =>
          set({ userData }),
      }),
      { name: "user-information" }
    )
  )
);

export default useUserInformation;
