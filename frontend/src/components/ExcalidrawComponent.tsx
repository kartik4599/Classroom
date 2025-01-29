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

  const hidingBoardElements = () => {
    const width = boardHtmlRef.current?.offsetWidth;
    if (!width) return;

    if (width >= 768) {
      const [header] = document.getElementsByClassName("App-menu App-menu_top");
      const [helpButton] = document.getElementsByClassName(
        "layer-ui__wrapper__footer-right zen-mode-transition"
      ) as HTMLCollectionOf<HTMLElement>;
      helpButton.style.display = "none";

      const [undoButton] = document.getElementsByClassName(
        "undo-redo-buttons zen-mode-transition"
      ) as HTMLCollectionOf<HTMLElement>;

      if (!header) return;
      const [header1, header2, header3] = header.childNodes as any;

      if (data?.host) {
        header1.childNodes[0].style.visibility = "hidden";
        header3.style.visibility = "hidden";
      } else {
        header1.style.display = "none";
        header2.style.display = "none";
        header3.style.display = "none";
        undoButton.style.display = "none";
      }
      return;
    }

    const [MenuButton] = document.getElementsByClassName(
      "dropdown-menu-button main-menu-trigger zen-mode-transition dropdown-menu-button--mobile"
    ) as HTMLCollectionOf<HTMLElement>;
    MenuButton.style.display = "none";

    const [sideContainer] = document.getElementsByClassName(
      "mobile-misc-tools-container"
    ) as HTMLCollectionOf<HTMLElement>;
    sideContainer.style.display = "none";

    if (!data?.host) {
      const [header] = document.getElementsByClassName(
        "Stack Stack_vertical"
      ) as HTMLCollectionOf<HTMLElement>;
      header.style.display = "none";

      const [footerBar] = document.getElementsByClassName(
        "App-toolbar-content"
      ) as HTMLCollectionOf<HTMLElement>;
      footerBar.style.display = "none";
    }
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

  useEffect(() => {
    setTimeout(hidingBoardElements, 5);
    window.addEventListener("resize", () => setTimeout(hidingBoardElements, 5));
  }, [data?.host]);

  return (
    <div
      ref={boardHtmlRef}
      className="h-[70vh] w-full shadow-md rounded-lg overflow-hidden"
    >
      <Excalidraw
        UIOptions={{ tools: { image: false } }}
        // key={new Date().getTime()}
        excalidrawAPI={(api) => {
          boardRef.current = api;
        }}
        // theme={creator ? THEME.LIGHT : THEME.DARK}
        onChange={onChange}
      />
    </div>
  );
};

export default ExcalidrawComponent;
