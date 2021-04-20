const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  user: {
        type: String,
        required: true,
        ref: 'User',
    },
  createdAt: { type: Date }
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema)

module.exports = Chatroom;

// creator: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//     },
//   receiver: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User',
//     },