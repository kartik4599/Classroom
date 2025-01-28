import Express from "express";
import { Server } from "socket.io";
import router from "./routes";
import cors from "cors";

const app = Express();
app.use(cors({ origin: "*" }), Express.json());

app.use("/api", router);
const server = app.listen(4999);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.emit("connection", socket.id);

  socket.on("draw-send", (data) => {
    socket.broadcast.emit("draw-receive", data);
  });

  socket.on("draw-sending", (data) => {
    socket.broadcast.emit("draw-receiving", data);
  });
});
