import { Excalidraw, THEME } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useEffect, useRef } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:4999/");
const creator = location.href.includes("o=0");

const ExcalidrawComponent = () => {
  const boardRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const previousElements = useRef<string | null>(null);

  const checkTheChange = (elements: readonly ExcalidrawElement[]) => {
    const stringObj = JSON.stringify(elements);
    if (previousElements.current === stringObj) return false;
    previousElements.current = stringObj;
    return stringObj;
  };

  const onChange = async (elements: readonly ExcalidrawElement[]) => {
    if (!elements.length || !creator) return;
    const value = checkTheChange(elements);
    if (!value) return;
    socket.emit("draw-sending", value);
  };

  useEffect(() => {
    if (creator) return;
    socket.on("draw-receiving", (data) => {
      const elements = JSON.parse(data);
      boardRef.current?.updateScene({ elements });
    });
  }, [socket, creator]);

  useEffect(() => {
    setTimeout(() => {
      const [island1, island2] = document.getElementsByClassName(
        "Island"
      ) as HTMLCollectionOf<HTMLElement>;

      const [island3] = document.getElementsByClassName(
        "mobile-misc-tools-container"
      ) as HTMLCollectionOf<HTMLElement>;

      island1.style.display = creator ? "" : "none";
      island2.style.display = creator ? "" : "none";
      island3.style.display = "none";
      (
        island2.childNodes[0].childNodes[0].childNodes[0] as HTMLElement
      ).style.display = "none";
    }, 5);
  }, [creator]);

  return (
    <div className="h-[70vh] w-full shadow-md rounded-lg overflow-hidden">
      <Excalidraw
        UIOptions={{ tools: { image: false } }}
        // key={new Date().getTime()}
        excalidrawAPI={(api) => {
          boardRef.current = api;
        }}
        theme={creator ? THEME.LIGHT : THEME.DARK}
        onChange={onChange}
      />
    </div>
  );
};

export default ExcalidrawComponent;
