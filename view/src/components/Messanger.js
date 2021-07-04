import React, { useState, useEffect} from 'react';
// import { userContext } from '../App';
import io from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Col, Row, Card } from 'react-bootstrap';
import './../App.css';

const socket = io();


const Messanger = () => {
  const { user, isAuthenticated } = useAuth0();

  // const { users, setUsers } = useContext(userContext);

  const [messangerUsers, setMessangerUsers] = useState([]); //chatusers

  const [messageList, setMessageList] = useState([]);

  const [currentRoom, setCurrentRoom] = useState(user.name);

  const [messangerMessage, setMessangerMessage] = useState({
    name: '',
    message: '',
    room: '',
    isPrivate: false,
  });//chatmessage

  // all our necessary functions
  const userJoins = () => {
    socket.emit('userJoin', user.name);
  };

  const handleChange = (event) => {
    //we need to set the every message to our state so we use the spread factor to make a 
    //a copy of the messages and then update our statw
    setMessangerMessage({
      ...messangerMessage,
      [event.target.name]: event.target.value
    });
  };

  const submitNewMessage = (event) => {
    event.preventDefault();

    const newMessage = {
      name: messangerMessage.name,
      message: messangerMessage.message,
      room: currentRoom,
      isPrivate: privateMessage(currentRoom, messangerUsers),
    };

    socket.emit('newMessage', newMessage);

    setMessangerMessage({ name: user.name, message: '' });
  };

  const enteringRoom = (event) => {
    let oldRoom = currentRoom;
    let newRoom = event.target.textContent;
    setCurrentRoom(newRoom);
    socket.emit('roomEntered', { oldRoom, newRoom });
    setMessageList([]);
  };

  const privateMessage = (roomname, activeUserList) => {
    let isPrivate = false;
    activeUserList.forEach((username) => {
      if (username === roomname) {
        isPrivate = true;
      }
    });

    return isPrivate;
  };
  //////////////////////////////////////////////////////////////////////////////////////////

  // we now need a way to listen on our socket channel for new and active users 
  socket.on('userList', (userList) => {
    setMessangerUsers(userList);
    setMessangerMessage({
      name: user.name,
      message: messangerMessage.message
    });
  });

 
  useEffect(() => {
    userJoins();
  }, []);


  //we need to listen on our socket channel for messages being sent from the server as well
  socket.on('newMessage', (newMessage) => {
    setMessageList([
      ...messageList,
      {
        name: newMessage.name,
        message: newMessage.message,
        isPrivate: newMessage.isPrivate,
      }
    ]);
  });
    return (
      <>
        {/* for the logic here we use the short circuit method since are 
        checking for just one condition authenticated */}
        {isAuthenticated && (
          <Container className= "Messanger">
            <Row>
                <Col
                  xs={5}
              >
                <Card className='leftpane'>
                  <br />
                  <h6>
                    Email : <b>{user.email }</b>
                  </h6>
                  <br />
                  <h6>
                    Users Online:
                  </h6>
                  <ul>
                    {messangerUsers.map((user) => {
                      return (
                        <li
                          onClick={enteringRoom}
                          key={user}>
                          {user}
                        </li>
                      );
                    })}
                  </ul>
                  </Card>
              </Col>
              &nbsp; &nbsp;
              <Col className="mainpane">
                <p>Messanger({ currentRoom})</p>
                <div id='messangerMessages'>&nbsp; &nbsp; Messages:
                  <Card>
                    <ul>{messageList.map((messanger, index) => {
                      return (
                        <li key={index}>
                          <i>{messanger.name}: </i>
                          <i>
                            <span style={{ color: 'black' }}>
                              <b>{messanger.message}</b>
                            </span>
                          </i>
                        </li>
                      );
                    })}</ul>
                  </Card>
                </div>
              </Col>
            </Row>
            <Col className="bottompane">
              <form onSubmit={submitNewMessage}>
              <input
                  type='text'
                  name='message'
                  class='form-control'
                  value={messangerMessage.message}
                  onChange={handleChange}
                  required
                />
                <br />
                <input
                  type='submit'
                  class='btn btn-success btn-sm'
                  value='send'
                />
                <br />
                <br />
            </form>
            </Col>
          </Container>
        )}
      </>
    );
}

export default Messanger;
