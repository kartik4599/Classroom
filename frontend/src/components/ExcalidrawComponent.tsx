import { socket } from "@/App";
import useRoom from "@/hooks/useRoom";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ExcalidrawComponent = () => {
  const { roomId } = useParams();

  const boardHtmlRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const previousElements = useRef<string | null>(null);
  const { data, setMember, removeMember } = useRoom();

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
    if (data?.host) return;
    socket.on("draw-receiving", (data) => {
      const elements = JSON.parse(data);
      boardRef.current?.updateScene({ elements });
    });
  }, [socket, data?.host]);

  useEffect(() => {
    if (!roomId) return;
    socket.on("user-joined", (user) => {
      setMember(user);
      socket.emit("draw-sending", roomId, previousElements.current);
    });

    socket.on("user-left", (userId) => {
      removeMember(userId);
    });
  }, [roomId]);

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
