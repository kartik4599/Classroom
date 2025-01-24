import {
  Editor,
  BackgroundComponentBackgroundType,
  Color4,
  Rect2,
  Erase,
  SVGRenderer,
} from "js-draw";
import "js-draw/styles";
import { MaterialIconProvider } from "@js-draw/material-icons";
import { useEffect, useRef } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:4999/");
const creator = location.href.includes("o=0");

const DrawComponent = () => {
  const editorRef = useRef<Editor | null>(null);

  const initBoard = () => {
    if (editorRef.current) editorRef.current.remove();

    const board = document.getElementById("board")!;
    editorRef.current = new Editor(board, {
      iconProvider: new MaterialIconProvider(),
      wheelEventsEnabled: false,
      minZoom: 1,
      maxZoom: 1,
    });

    editorRef.current.dispatch(
      editorRef.current.setBackgroundStyle({
        color: Color4.white,
        autoresize: false,
        type: BackgroundComponentBackgroundType.SolidColor,
      })
    );
    editorRef.current.getRootElement().style.height = creator
      ? "551px"
      : "500px";
    editorRef.current.getRootElement().style.width = "500px";

    if (!creator) return editorRef.current.setReadOnly(true);

    editorRef.current.addToolbar();

    editorRef.current?.getRootElement().addEventListener("mousedown", () => {
      // setInterval(() => {
      //   console.log(editorRef.current?.toSVG().outerHTML);
      // }, 1000);
    });

    editorRef.current?.getRootElement().addEventListener("mouseup", () => {
      socket.emit("draw-send", editorRef.current?.toSVG().outerHTML);

      console.log(editorRef.current?.toSVG().outerHTML);
    });

    editorRef.current.getRootElement().addEventListener("touchend", () => {
      socket.emit("draw-send", editorRef.current?.toSVG().outerHTML);
    });

    editorRef.current
      .getRootElement()
      .addEventListener("touchmove", async () => {
        const svg = (await editorRef.current?.toSVGAsync())?.outerHTML;
        console.log(svg);
      });
  };

  useEffect(() => {
    initBoard();
  }, []);

  useEffect(() => {
    if (creator) return;
    socket.on("draw-receive", (data) => {
      const elems = editorRef.current?.image.getElementsIntersectingRegion(
        new Rect2(0, 0, 500, 500)
      );
      editorRef.current?.dispatch(new Erase(elems!));
      editorRef.current?.loadFromSVG(data, true);
    });

    socket.on("draw-receiving", (data) => {
      editorRef.current?.loadFromSVG(data);
    });
  }, [socket]);

  return <div id="board" className="shadow-md"></div>;
};

export default DrawComponent;
