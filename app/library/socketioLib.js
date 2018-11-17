const socketio = require('socket.io');

const tokenLib = require('./tokenLib');

const shortId = require('shortid');

const redisLib = require("./redisLib");

const events = require('events');
const eventEmitter = new events.EventEmitter();

const mongoose = require('mongoose');

const notificationModel = mongoose.model('Notification');

let setServer = (server) => {

    let io = socketio.listen(server);
    let myIo = io.of('/')
    
    myIo.on('connection', (socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId
                    let value = fullName

                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsersListToDo", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.

                            redisLib.getAllUsersInAHash('onlineUsersListToDo', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`${fullName} is online`);
                                   
                                    
 
                                    socket.broadcast.emit('online-user-list', result);
                                }
                            })
                        }
                    })

                }
            })

        }) // end of listening set-user event


        socket.on('disconnect', () => {
           

            console.log("user is disconnected");

            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUsersListToDo', socket.userId)
                redisLib.getAllUsersInAHash('onlineUsersListToDo', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // socket.to(socket.room).broadcast.emit('online-user-list', result);
                        socket.broadcast.emit('online-user-list', result);
                    }
                })
            }

        }) // end of on disconnect


        socket.on('notify-updates', (data) => {
            console.log("socket notify-updates called");
            
            socket.broadcast.emit('noti', data);
            
            eventEmitter.emit('save-notification',data.message);
            // socket.emit(data.userId,data)
        });
        socket.on('friend-notification', (friendData) => {
            console.log("socket friend-notification called");
            console.log(`${friendData}`);
            socket.broadcast.emit('friendRequest', friendData);
            // socket.emit(data.userId,data)
        });
    });
}

        eventEmitter.on('save-notification',(message)=>{
            let msg = new notificationModel({
                notiId:shortId.generate(),
                text:message.text,
                concernId:message.concernId
            })
            msg.save()
            .then((data)=>{
                console.log('data','saved noti to db')
            })
            .catch((err)=>console.log(`${err}, noti not saved`));
        })

module.exports = {
    setServer: setServer
}