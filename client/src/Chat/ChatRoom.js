import React from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { isAuthenticated } from '../auth/auth'

import './chat.css'

const ChatRoom = ({ match, socket }) => {
    const { token } = isAuthenticated()
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      
      messageRef.current.value = "";
    }
  };
  React.useEffect(() => {
    Axios.get(`http://localhost:8080/message/${chatroomId}`, {
    }).then((res) => setMessages(res.data));
  }, [chatroomId]);
  React.useEffect(() => {
    //const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = jwt_decode(token) //JSON.parse(atob(token.split(".")[1]));
      console.log(payload);
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);
  
  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }
    
    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  console.log(messages);
  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.user ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>
              {message.message} :
              {message?.createdAt}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatRoom);
