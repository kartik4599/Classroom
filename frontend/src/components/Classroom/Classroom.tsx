import { useNavigate, useParams } from "react-router-dom";
import ExcalidrawComponent from "../ExcalidrawComponent";
import { Button } from "../ui/button";
import Header from "./Header";
import ParticipantList from "./ParticipantList";
import { useEffect } from "react";
import useUserInformation from "@/hooks/useUserInformation";
import useRoom from "@/hooks/useRoom";
import { socket } from "@/App";
import { LogOut } from "lucide-react/icons";
import axios from "../../lib/utils";

const Classroom = () => {
  const { roomId } = useParams();
  const userData = useUserInformation((state) => state.userData);
  const { setData, removeMember, clearData } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId || !userData?.id) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        const { data } = await axios.post("/get-room", {
          userId: userData.id,
          roomId,
        });
        setData({ ...data, host: data?.hostId === userData?.id });

        socket.emit("join-room", roomId, userData.id);
      } catch (e) {
        navigate("/");
      }
    })();

    return clearData;
  }, [roomId, userData]);

  const leaveHandler = async (userId: number) => {
    await axios.post("leave-room", {
      userId,
      roomNumber: roomId,
    });
    socket.emit("leave-room", roomId, userId);
    removeMember(userId);
    if (userId === userData?.id) navigate("/");
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <ExcalidrawComponent leaveHandler={leaveHandler} />
            <div className="flex justify-center space-x-4">
              <Button
                onClick={leaveHandler.bind(null, userData?.id!)}
                className="bg-red-600 hover:bg-red-700 text-white font-mono"
              >
                <LogOut />
                Leave Class
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <ParticipantList leaveHandler={leaveHandler} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classroom;
