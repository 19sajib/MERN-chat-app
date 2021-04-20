import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";

import { isAuthenticated } from '../auth/auth'

import './common.css'

const ChatDashboard = (props) => {

    const { user } = isAuthenticated()
    const userId = user._id

  const [chatrooms, setChatrooms] = React.useState([]);
  const [chatroomName, setChatroomName] = React.useState("");

  const getChatrooms = () => {
    axios
      .get("http://localhost:8080/chatroom", {
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  const addNewChatroom = () => {
    axios
      .post(
        "http://localhost:8080/chatroom",
        { name: chatroomName, user: userId },
      )
      .then((res) => {
        setChatroomName("");
        getChatrooms();
      })
      .catch((err) => {
        makeToast("error", err.response);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            value={chatroomName}
            placeholder="Create Chat Room"
            onChange={(e) => setChatroomName(e.target.value)}
          />
        </div>
      </div>
      <button onClick={addNewChatroom}>Create Chatroom</button>
      <div className="chat">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chat_title">
            <Link to={"/chatroom/" + chatroom._id}>
            <div>{chatroom.name}</div>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatDashboard;