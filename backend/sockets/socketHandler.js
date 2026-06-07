const { Socket } = require("socket.io")

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("user Connected:", socket.id)
        socket.on("join-room", (roomId) => {

            console.log("Room is connected")

            socket.join(roomId)

            console.log(`user joined room :${roomId}`)

            const room = io.sockets.adapter.rooms.get(roomId);

            const roomSize = room ? room.size : 0;

            if (roomSize === 2) {

                socket.to(roomId).emit("user-joined", socket.id);

            }
        })

        socket.on("offer", (data) => {
            io.to(data.to).emit("offer", {
                offer: data.offer,
                from: socket.id
            })
        })

        socket.on("answer", (data) => {

            io.to(data.to).emit("answer", {
                answer: data.answer,
                from: socket.id
            });
        });

        socket.on("ice-candidate", (data) => {

            io.to(data.to).emit("ice-candidate", {
                candidate: data.candidate,
                from: socket.id
            });

        });
        socket.on("ice-candidate", (data) => {

            io.to(data.to).emit("ice-candidate", {
                candidate: data.candidate,
                from: socket.id
            });

        });


        socket.on("disconnected", () => {

            console.log("user-disconnected")
        })

    })
}








//socket.emit("join-room","room1")


// module.exports = (io)=>{

//     io.on("connection",(socket)=>{

//         console.log("User Connected :",socket.id);

//         socket.on("disconnect",()=>{

//             console.log("User Disconnected");

//         });

//     });

// }

