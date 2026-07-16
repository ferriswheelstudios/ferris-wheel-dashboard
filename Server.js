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

io.on("connection", (socket) => {

  console.log("Device Connected");

  socket.emit("dashboardData", dashboardData);

  socket.on("updateData", (data) => {
    dashboardData = data;
    io.emit("dashboardData", dashboardData);
  });

  socket.on("lyricsScroll", (amount) => {
    io.emit("lyricsScroll", amount);
  });

});


server.listen(3000, "0.0.0.0", () => {
  console.log("Server Running : http://localhost:3000");
});
// Live Clock
function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

setInterval(updateClock, 1000);
updateClock();


// Remaining Session Timer
let sessionEnd = null;

socket.on("dashboardData", (data) => {

    // tumhara existing dashboard update code yahin rahega

    if(data.sessionTime){

        const parts = data.sessionTime.split("-");

        if(parts.length === 2){

            const end = parts[1].trim();

            const today = new Date();

            const endDate = new Date(today.toDateString() + " " + end);

            sessionEnd = endDate;
        }

    }

});

function updateRemaining(){

    if(!sessionEnd){
        return;
    }

    const now = new Date();

    let diff = sessionEnd - now;

    if(diff < 0){
        diff = 0;
    }

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000)/60000);
    const secs = Math.floor((diff % 60000)/1000);

    document.getElementById("timer").textContent =
        String(hrs).padStart(2,"0")+":"+
        String(mins).padStart(2,"0")+":"+
        String(secs).padStart(2,"0");

}

setInterval(updateRemaining,1000);