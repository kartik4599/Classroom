import Express from "express";
import { Server } from "socket.io";
import router from "./routes";
import cors from "cors";
import database from "./database/database";
import { eq } from "drizzle-orm";
import { User } from "./database/schema";

const app = Express();
app.use(cors({ origin: "*" }), Express.json());

app.use("/api", router);
const server = app.listen(4999);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.emit("connection", socket.id);

  socket.on("join-room", async (roomId, userId) => {
    const user = await database.query.User.findFirst({
      where: eq(User.id, userId),
    });
    if (!user) return;
    socket.join(roomId);
    io.to(roomId).emit("user-joined", user);
  });

  socket.on("leave-room", async (roomId, userId) => {
    const user = await database.query.User.findFirst({
      where: eq(User.id, userId),
    });
    if (!user) return;

    socket.leave(roomId);
    io.to(roomId).emit("user-left", user.id);

    await database
      .update(User)
      .set({ socketId: null })
      .where(eq(User.id, userId));
  });

  socket.on("draw-send", (data) => {
    socket.broadcast.emit("draw-receive", data);
  });

  socket.on("draw-sending", (roomId, data) => {
    io.to(roomId).emit("draw-receiving", data);
  });
});
