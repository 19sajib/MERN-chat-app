import React from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";
import { CssBaseline,Typography,Paper,List,
  ListItem,ListItemAvatar,ListItemText,Button } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';


import { isAuthenticated } from '../auth/auth'

import './common.css'

import useStyles from './style';

const ChatDashboard = (props) => {

  const classes = useStyles();
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
        { name: chatroomName, user },
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
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Inbox
        </Typography>
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
      <Button color="primary" variant="outlined" onClick={addNewChatroom}>Create Chatroom</Button>
      <List className={classes.list}>
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chat_title">
            <ListItem button component={Link} to={"/chatroom/" + chatroom._id} >
            <ListItemAvatar>
                  {chatroom?.userAvatar.map ((avatar) => <Avatar alt="sajib" src={avatar} />)}
              </ListItemAvatar>
            <ListItemText primary={chatroom.name} secondary={moment(chatroom.createdAt).format('LLLL')} />
              </ListItem>
          </div>
        ))}
      </List>
      </Paper>
    </React.Fragment>
  );
};

export default ChatDashboard;