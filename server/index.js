import { createServer } from "http";
import { Server } from "socket.io";
import { uuidv4 } from "./utils.js";
import { Users } from "./users.js";
const m = (name, text, id) => ({ name, text, id });
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8081",
  },
});
const users = new Users();

io.on("connection", (socket) => {
  console.log(`${socket.id}  connected`);

  socket.on("userJoined", (data, cb) => {
    socket.join(data.room);

    cb({ userId: socket.id });

    socket.emit("newMessage", {
      id: uuidv4(),
      text: `Добро пожаловать ${data.name}`,
      time: new Date(),
      messageId: socket.id,
      system: true,
    });

    users.remove(socket.id);
    users.add({
      id: data.id,
      userId: socket.id,
      name: data.name,
      room: data.room,
    });

    socket.broadcast.to(data.room).emit("newMessage", {
      id: uuidv4(),
      text: `Пользователь ${data.name} присоединился`,
      time: new Date(),
      messageId: socket.id,
      system: true,
    });
  });

  socket.on("newMessage", (msg) => {
    const user = users.get(msg.messageId);
    io.to(user.room).emit("newMessage", {
      id: msg.id,
      messageId: user.userId,
      time: "12:22",
      system: msg.system,
      text: msg.text,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id}  disconnected`);
  });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
