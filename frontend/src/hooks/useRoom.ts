import { create } from "zustand";

interface Member {
  id: number;
  name: string;
  status: boolean;
}

interface RoomData {
  id: string;
  hostId: number;
  members: Member[];
  host: boolean;
}

interface Room {
  data?: RoomData;
  setData: (data: RoomData) => void;
  clearData: () => void;
  setMember: (user: Member) => void;
  removeMember: (userId: number) => void;
  setUserStatus: (userId: number, status: boolean) => void;
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
  setUserStatus: (userId, status) => {
    let members = get().data?.members;
    if (!members) return;
    members = members?.map((member) =>
      member.id === userId ? { ...member, status } : member
    );
    set({ data: { ...get().data!, members } });
  },
}));

export default useRoom;
