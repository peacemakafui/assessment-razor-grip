const express = require('express');
const bodyParser = require('body-parser');
//we use the dotenv module because we need an env file to securely hold confidential parameters
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000

//we need a way to create a real time connection for messages to be sent hence we use socket.io
const server = require('http').createServer(app)
const io = require('socket.io')(server)

//we need a database driver to our mongodb so we use mongoose for that
const mongoose = require('mongoose');

//we want to separate our user routes from the logic to enable easy maintenance of our code
const userRoutes = require('./routes/users')

const path = require('path');


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const database = mongoose.connection
database.once('open', () => console.log('Connection to database successful'))

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/users', userRoutes)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))



//creating a user object to handle all user access and ids
let users = {}

//socket io connection
io.on('connection', socket => {
    
    //we need to keep track of users who have connected so we use the code below
    socket.on('userJoin', (username) => {
        users[socket.id] = username;
        socket.join(username);
        socket.join('General Message');
        console.log('user object after connection: ', users);
        io.emit('userList', [...new Set(Object.values(users))]);
    });

    //we need to be able to accept new messages from our chat page
    socket.on('newMessage', newMessage => {
        io.to(newMessage.room).emit('newMessage', {
            name: newMessage.name,
            message: newMessage.message,
            isPrivate: newMessage.isPrivate
        });
    })

    // we need to be able to join a chat session: that is the room where socket.io broadcasts the texts
    socket.on('roomEntered', ({ oldRoom, newRoom }) => {
        socket.leave(oldRoom);
        io.to(oldRoom);
        io.to(newRoom);
        socket.join(newRoom);
    });

    //removing all non-active users: that is users that have disconnected from the io server
    socket.on('disconnect', () => {
        delete users[socket.id]
        io.emit('userList', [...new Set(Object.values(users))]);
        console.log('Users after disconnection :', users)
    })
    
})
app.get('/*', (req, res) => res.sendFile(path.join(__dirname,'build' ,'index.html')))
server.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })