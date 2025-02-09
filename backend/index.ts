import Express from "express";
import { Server } from "socket.io";
import router from "./routes";
import cors from "cors";
import database from "./database/database";
import { eq } from "drizzle-orm";
import { User } from "./database/schema";
import path from "path";

const app = Express();
app.use(cors({ origin: "*" }), Express.json());

app.use("/api", router);
const server = app.listen(4999);
const io = new Server(server, { cors: { origin: "*" } });

const dirname = path.resolve();

app.use(Express.static(path.join(dirname, "dist")));
app.use("*", (req, res) =>
  res.sendFile(path.join(dirname, "dist", "index.html"))
);

io.on("connection", (socket) => {
  socket.emit("connection", socket.id);

  socket.on("join-room", async (roomId, userId) => {
    const user = await database.query.User.findFirst({
      where: eq(User.id, userId),
    });
    if (!user) return;
    socket.join(roomId);
    io.to(roomId).emit("user-joined", user);
    socket.to(roomId).emit("chat-message", {
      user: "System",
      text: `${user.name} has joined the room.`,
      timestamp: new Date(),
    });
  });

  socket.on("leave-room", (roomId, userId) => {
    // socket.leave(roomId);
    io.to(roomId).emit("user-left", userId);
    (async () => {
      const user = await database.query.User.findFirst({
        where: eq(User.id, userId),
      });

      io.to(roomId).emit("chat-message", {
        user: "System",
        text: `${user?.name} has left room.`,
        timestamp: new Date(),
      });
    })();
  });

  socket.on("draw-sending", (roomId, data) => {
    io.to(roomId).emit("draw-receiving", data);
  });

  socket.on("going-offline-user", (roomId, userId) => {
    socket.leave(roomId);
    io.to(roomId).emit("gone-offline-user", userId);
  });

  socket.on("chat-message", (roomId, data) => {
    io.to(roomId).emit("chat-message", { ...data, timestamp: new Date() });
  });
});
