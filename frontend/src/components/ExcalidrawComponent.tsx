import { socket } from "@/App";
import useRoom from "@/hooks/useRoom";
import useUserInformation from "@/hooks/useUserInformation";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExcalidrawComponent = ({
  leaveHandler,
}: {
  leaveHandler: (userId: number) => void;
}) => {
  const { roomId } = useParams();

  const boardHtmlRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const previousElements = useRef<string | null>(null);
  const { data, setMember, removeMember, setUserStatus } = useRoom();
  const userData = useUserInformation((state) => state.userData);
  const navigate = useNavigate();

  const checkTheChange = (elements: readonly ExcalidrawElement[]) => {
    const stringObj = JSON.stringify(elements);
    if (previousElements.current === stringObj) return false;
    previousElements.current = stringObj;
    return stringObj;
  };

  const onChange = async (elements: readonly ExcalidrawElement[]) => {
    if (!elements.length || !data?.host) return;
    const value = checkTheChange(elements);
    if (!value) return;
    socket.emit("draw-sending", roomId, value);
  };

  useEffect(() => {
    if (!data) return;
    if (data.host) return;
    socket.on("draw-receiving", (data) => {
      const elements = JSON.parse(data);
      boardRef.current?.updateScene({ elements });
    });
  }, [socket, data]);

  useEffect(() => {
    if (!roomId) return;
    socket.on("user-joined", (user) => {
      setMember(user);
      socket.emit("draw-sending", roomId, previousElements.current);
      setUserStatus(user?.id, true);
    });
    socket.on("user-left", (userId) => {
      if (userData?.id === userId) {
        leaveHandler(userId);
        navigate("/");
      }
      removeMember(userId);
    });
    socket.on("gone-offline-user", (userId) => {
      setUserStatus(userId, false);
    });
  }, [roomId, userData?.id]);

  return (
    <div
      ref={boardHtmlRef}
      className="h-[70vh] w-full shadow-md rounded-lg overflow-hidden"
    >
      <Excalidraw
        UIOptions={{ tools: { image: false } }}
        excalidrawAPI={(api) => {
          boardRef.current = api;
        }}
        viewModeEnabled={!data?.host}
        zenModeEnabled
        onChange={onChange}
      />
    </div>
  );
};

export default ExcalidrawComponent;
