import { Router } from "express";
import database from "./database/database";
import { Room, User } from "./database/schema";
import { and, eq } from "drizzle-orm";

const router = Router();

router.post("/create-user", async (req, res) => {
  try {
    const { name } = req.body;
    const [user] = await database.insert(User).values({ name }).returning();
    res.json(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/create-room", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await database.query.User.findFirst({
      where: eq(User.id, userId),
    });

    if (!user) return res.status(404).send("User not found");

    const [room] = await database
      .insert(Room)
      .values({ hostId: userId })
      .returning();

    await database
      .update(User)
      .set({ roomId: room.id })
      .where(eq(User.id, userId));

    return res.json(room);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/join-room", async (req, res) => {
  try {
    const { userId, roomNumber } = req.body;

    const [user, room] = await Promise.all([
      database.query.User.findFirst({
        where: eq(User.id, userId),
      }),
      database.query.Room.findFirst({
        where: eq(Room.id, roomNumber),
      }),
    ]);

    if (!user || !room)
      return res.status(404).json({ error: "User or room not found" });

    await database
      .update(User)
      .set({ roomId: room.id })
      .where(eq(User.id, userId));

    return res.json(room);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/leave-room", async (req, res) => {
  try {
    const { userId, roomNumber } = req.body;

    const [user, room] = await Promise.all([
      database.query.User.findFirst({
        where: eq(User.id, userId),
      }),
      database.query.Room.findFirst({
        where: eq(Room.id, roomNumber),
        with: { members: true },
      }),
    ]);

    if (!user || !room)
      return res.status(404).json({ error: "User or room not found" });

    await database
      .update(User)
      .set({ roomId: null })
      .where(eq(User.id, userId));

    if (room.members.length === 1) {
      await database.delete(Room).where(eq(Room.id, roomNumber));
    }
    return res.json(room);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/get-room", async (req, res) => {
  try {
    const { userId, roomId } = req.body;

    const [member, room] = await Promise.all([
      database.query.User.findFirst({
        where: and(eq(User.id, userId), eq(User.roomId, roomId)),
      }),
      database.query.Room.findFirst({
        where: eq(Room.id, roomId),
        with: { members: true },
      }),
    ]);

    if (!member) return res.status(404).send("User not found");

    await database
      .update(User)
      .set({ status: true })
      .where(eq(User.id, userId));

    return res.json(room);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/add-socket", async (req, res) => {
  const { socketId, userId } = req.body;
  await database.update(User).set({ socketId }).where(eq(User.id, userId));

  return res.send("Socket added");
});

router.post("/get-existing-room", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await database.query.User.findFirst({
      where: eq(User.id, userId),
    });

    if (!user || !user.roomId)
      return res.status(404).json({ error: "User not found" });

    return res.json({ roomId: user.roomId });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/set-offline", async (req, res) => {
  try {
    const { userId } = req.body;

    await database
      .update(User)
      .set({ status: false })
      .where(eq(User.id, userId));

    res.send("User offline");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
export default router;
