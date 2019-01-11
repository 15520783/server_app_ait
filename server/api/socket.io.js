'use strict';

module.exports = function (socket, io) {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('message', (message) => {
        io.sockets.in(socket.room).emit('message', { type: 'new-message', text: message });
    });

    socket.on('room', function(room) {
        socket.leave(socket.room);
        socket.room = room;
        socket.join(room);
    });
}