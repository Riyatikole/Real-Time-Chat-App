const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());



app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongodb")
}).catch((err) => {
    console.log(err.message)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin:"http://localhost:3000",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket)=> {
    global.chatSocket = socket;
    
    socket.on("add-user", (userId) => {
        
        onlineUsers.set(userId, socket.id);
        console.log("userId",onlineUsers)

    });

    socket.on("send-msg", (data) => {
        console.log("data",data)
        const sendUserSocket = onlineUsers.get(data.to);
        console.log("tell",sendUserSocket)
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data);
            console.log("Message sent to:", data.to);
        } else {
            console.log("Recipient's socket not found");
        }
    });
})