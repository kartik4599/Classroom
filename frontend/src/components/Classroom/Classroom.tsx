import { NavLink, useNavigate, useParams } from "react-router-dom";
import ExcalidrawComponent from "../ExcalidrawComponent";
import { Button } from "../ui/button";
import Header from "./Header";
import ParticipantList from "./ParticipantList";
import { useEffect } from "react";
import axios from "axios";
import useUserInformation from "@/hooks/useUserInformation";
import useRoom from "@/hooks/useRoom";
import { socket } from "@/App";

const Classroom = () => {
  const { roomId } = useParams();
  const userData = useUserInformation((state) => state.userData);
  const { setData, setMember, removeMember } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId || !userData?.id) return;

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
  }, [roomId, userData]);

  const leaveHandler = () => {
    socket.emit("leave-room", roomId, userData?.id);
    removeMember(userData?.id!);
    navigate("/");
  };

  useEffect(() => {
    socket.on("user-joined", (user) => {
      setMember(user);
    });

    socket.on("user-left", (userId) => {
      removeMember(userId);
    });
  }, []);

  return (
    <div className="min-h-screen bg-amber-50">
      <NavLink to={"/"}>
        <Header />
      </NavLink>
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <ExcalidrawComponent />
            <div className="flex justify-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-mono">
                Raise Hand
              </Button>
              <Button
                onClick={leaveHandler}
                className="bg-red-600 hover:bg-red-700 text-white font-mono"
              >
                Leave Class
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <ParticipantList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classroom;
