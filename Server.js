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
    lyrics: "Paste Lyrics Here..."
};

const macClients = new Set();

io.on("connection", (socket) => {

    console.log("Device Connected");

    socket.emit("dashboardData", dashboardData);

    socket.on("registerMac", () => {
        macClients.add(socket);
        console.log("Mac Connected");

        socket.on("disconnect", () => {
            macClients.delete(socket);
            console.log("Mac Disconnected");
        });
    });

    socket.on("updateData", (data) => {

        dashboardData = {
            artist: data.artist || "",
            song: data.song || "",
            engineer: data.engineer || "",
            sessionTime: data.sessionTime || "",
            lyrics: data.lyrics || ""
        };

        io.emit("dashboardData", dashboardData);

    });

    socket.on("lyricsScroll", (amount) => {

        io.emit("lyricsScroll", amount);

    });

    socket.on("showSessionView", () => {

        console.log("SHOW SESSION VIEW BUTTON PRESSED");

        macClients.forEach((client) => {
            client.emit("showSessionView");
        });

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

    console.log("Server Running on Port " + PORT);

});