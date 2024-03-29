const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const userRoutes = require('./routes/user.js')
const chatRoomRoutes = require('./routes/chatRoom.js')
const messageRoutes = require('./routes/Messages.js')

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Routes 

app.use('/users', userRoutes)
app.use('/chatroom', chatRoomRoutes)
app.use('/message', messageRoutes)

app.get('/', (req, res) => {
    res.send('Hello from backend')
})

// Setting up server
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log(`Server is up and running on port: ${PORT}`))

// Connecting to mongoDB
const CONNECTION_URL = process.env.CONNECTION_URL

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, (err) => {
    if(err) return console.error(err);
    console.log("Connected to MongoDB")
})



// Socket.io setting from here

const jwt = require("jsonwebtoken")
const io = require("socket.io")(server)

//Bring in the models

const Message = require("./models/Message");
const User = require("./models/user");
const ChatRoom = require("./models/Chatroom")

// Socket.io core setting

io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {}
  });


io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", async ({ chatroomId, user }) => {
    socket.join(chatroomId);
    const chatroom = await ChatRoom.findOne({_id: chatroomId});
    const index = chatroom.user.findIndex((id) => id === String(user._id));
    if (index === -1) {
      chatroom.user.push(user._id)
      chatroom.userName.push(user.name)
      chatroom.userAvatar.push(user.avatar)
    }
    const updatedChatroom = await ChatRoom.findByIdAndUpdate(chatroomId, chatroom, { new: true})
    console.log(chatroom);
    console.log(updatedChatroom);
    // if(!chatroom) {
    //   const updateChatRoom = await ChatRoom.find({user: user._id});
    // }
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message?.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        name: user.name,
        message,
        createdAt: new Date()
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
        user: socket.userId,
      });
      await newMessage.save();
    }
  });
});