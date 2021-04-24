const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  user: {
        type: [String],
        default: [],
        required: true,
        ref: 'User',
    },
  userName: {
    type: [String],
    default: [],
     required: true
  },
  userAvatar: { 
    type: [String],
    default: []
   },
  lastMessageAt: { type: Date },
  createdAt: { 
    type: Date,
    default: new Date()
   },
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