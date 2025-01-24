import Express from "express";
import { Server } from "socket.io";

const app = Express();

const server = app.listen(4999);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("draw-send", (data) => {
    socket.broadcast.emit("draw-receive", data);
  });

  socket.on("draw-sending", (data) => {
    socket.broadcast.emit("draw-receiving", data);
  });
});
