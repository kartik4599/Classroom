import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RoomData {
  id: string;
  hostId: number;
  members: [
    {
      id: number;
      name: string;
      roomId: string;
    }
  ];
  host: boolean;
}

interface Room {
  data?: RoomData;
  setData: (data: RoomData) => void;
}

const useRoom = create<Room>()(
  devtools(
    persist(
      (set) => ({
        setData: (data: RoomData) => set({ data }),
      }),
      { name: "room-information" }
    )
  )
);

export default useRoom;
