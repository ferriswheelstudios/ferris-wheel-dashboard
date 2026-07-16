const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let dashboardData = {
    artist: "Artist Name",
    song: "Song Name",
    engineer: "Engineer",
    sessionTime: "12:00 PM - 02:00 PM",
    lyrics: "Paste lyrics here..."
};

io.on("connection", (socket)=>{

    console.log("Device Connected");

    socket.emit("dashboardData", dashboardData);

    socket.on("updateData",(data)=>{
        dashboardData = data;
        io.emit("dashboardData", dashboardData);
    });

    socket.on("lyricsScroll",(amount)=>{
        io.emit("lyricsScroll", amount);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("Server Running");
});