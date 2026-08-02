const express = require("express");
const http = require("http");
const https = require("https");
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

        socket.on("disconnect", () => {
            macClients.delete(socket);
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

        // Google Sheet Save
        const postData = JSON.stringify({
            date: new Date().toLocaleDateString("en-IN"),
            artist: data.artist || "",
            song: data.song || "",
            engineer: data.engineer || "",
            time: data.sessionTime || ""
        });

        const req = https.request(
            "https://script.google.com/macros/s/AKfycbwkxhFfi_ehSeQp2rNZutj7KD5Hqna7nZaB7-Mj7XDAX6wzq-L7u-ivk0uKr8FbnGs0/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(postData)
                }
            },
            (res) => {
                res.on("data", () => {});
                res.on("end", () => {
                    console.log("Google Sheet Updated");
                });
            }
        );

        req.on("error", (err) => {
            console.error("Google Sheet Error:", err.message);
        });

        req.write(postData);
        req.end();

    });

    socket.on("lyricsScroll", (amount) => {
        io.emit("lyricsScroll", amount);
    });

    socket.on("showSessionView", () => {
        macClients.forEach((client) => {
            client.emit("showSessionView");
        });
    });

    socket.on("showDashboard", () => {
        macClients.forEach((client) => {
            client.emit("showDashboard");
        });
    });

    socket.on("refreshmentRequest", (data) => {
        macClients.forEach((client) => {
            client.emit("refreshmentRequest", data);
        });
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server Running on Port " + PORT);
});