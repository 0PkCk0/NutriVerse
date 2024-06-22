const http = require("http");
const app = require("./index");
const socketio = require('socket.io');
const cors = require("cors"); // Importa cors


app.use(cors());
const server = http.createServer(app);

// link https://nutriverse-b13w.onrender.com
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ user1, user2 }) => {
        console.log(user1);
        console.log(user2);
        const room = [user1, user2].sort().join("_");
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("sendMessage", (message) => {
        const room = [message.senderId, message.receiverId].sort().join("_");
        console.log(message.payload);
        socket.to(room).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// server listening
server.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
  
module.exports = {app, server};
