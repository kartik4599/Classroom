import useUserInformation from "@/hooks/useUserInformation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import axios from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { userData, setUserData } = useUserInformation();
  const [name, setName] = useState(userData?.name);
  const [roomNumber, setRoomNumber] = useState("");
  const [existingRoomNumber, setExistingRoomNumber] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      let userId = userData?.id;
      if (!userData?.id) {
        const { data } = await axios.post("/create-user", { name });
        setUserData(data);
        userId = data.id;
      }

      const { data } = await axios.post("/create-room", { userId });
      navigate("/room/" + data.id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      let userId = userData?.id;
      if (!userData?.id) {
        const { data } = await axios.post("/create-user", { name });
        setUserData(data);
        userId = data.id;
      }

      const { data } = await axios.post("/join-room", {
        userId,
        roomNumber: roomId,
      });
      navigate("/room/" + data.id);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!userData?.id) return;
    (async () => {
      const { data } = await axios.post("/get-existing-room", {
        userId: userData?.id,
      });
      setExistingRoomNumber(data.roomId);
    })();
  }, [userData?.id]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col gap-y-4 items-center justify-center p-4 retro-scanlines">
      <div className="w-full max-w-md bg-[#ece6c2]/50 border-4 border-[#6f5643] rounded-lg shadow-lg p-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        <h1 className="text-4xl font-bold text-center font-mono text-[#6f5643] font-retro retro-glow relative z-10">
          Classroom
        </h1>
        <div className="space-y-4 relative z-10">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            disabled={!!userData?.id}
            onChange={(e) => setName(e.target.value)}
            className="border-[#cc6b49] focus-visible:ring-0 text-[#cc6b49] placeholder-[#cc6b49]"
          />

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#6f5643]/80">
              <TabsTrigger
                value="create"
                className="text-gray-100 data-[state=active]:bg-[#cc6b49] data-[state=active]:text-gray-100"
              >
                Create Room
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className="text-gray-100 data-[state=active]:bg-[#cc6b49] data-[state=active]:text-gray-100"
              >
                Join Room
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Button
                className="w-full bg-[#cc6b49]/90 hover:bg-[#cc6b49] text-gray-100 font-bold font-retro"
                onClick={handleCreateRoom}
                disabled={!name}
              >
                Create Room
              </Button>
            </TabsContent>
            <TabsContent value="join">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter room number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="border-[#cc6b49] focus-visible:ring-0 text-[#cc6b49] placeholder-[#cc6b49]"
                />
                <Button
                  className="w-full bg-[#cc6b49]/90 hover:bg-[#cc6b49] text-gray-100 font-bold font-retro"
                  onClick={handleJoinRoom.bind(this, roomNumber)}
                  disabled={!name || !roomNumber}
                >
                  Join Room
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {existingRoomNumber && (
        <div className="w-full max-w-md bg-[#ece6c2]/50 border-4 border-[#6f5643] rounded-lg shadow-lg p-6 space-y-6 relative overflow-hidden">
          <h3 className="text-xl font-bold text-[#6f5643] font-mono">
            Existing Room
          </h3>
          <div className="flex items-center justify-between">
            <h6 className="truncate pr-10">
              Room number :{" "}
              <span className="text-[#cc6b49] font-bold">
                {existingRoomNumber}
              </span>
            </h6>
            <Button onClick={handleJoinRoom.bind(this, existingRoomNumber)}>
              Join Room
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
