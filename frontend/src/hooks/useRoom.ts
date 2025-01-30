import { create } from "zustand";

interface RoomData {
  id: string;
  hostId: number;
  members: {
    id: number;
    name: string;
  }[];
  host: boolean;
}

interface Room {
  data?: RoomData;
  setData: (data: RoomData) => void;
  clearData: () => void;
  setMember: (user: { id: number; name: string }) => void;
  removeMember: (userId: number) => void;
}

const useRoom = create<Room>()((set, get) => ({
  setData: (data: RoomData) => set({ data }),
  clearData: () => set({ data: undefined }),
  setMember: (user) => {
    const members = get().data?.members;
    if (!members) return;
    if (members?.find((member) => member.id === user.id)) return;
    members?.push(user);
    set({ data: { ...get().data!, members } });
  },
  removeMember: (userId) => {
    const members = get().data?.members.filter(
      (member) => member.id !== userId
    );
    if (!members) return;
    set({ data: { ...get().data!, members } });
  },
}));

export default useRoom;
