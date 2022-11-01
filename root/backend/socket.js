let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {cors: {origin: '*',}})
        return io
    },

    getIO: () => {
        if(!io){
            return res.status(400).send("socket.io not initialized")
        }
        return io
    }
}