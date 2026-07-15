const socket = io();

function sendData() {

    const data = {

        artist: document.getElementById("artist").value,

        song: document.getElementById("song").value,

        engineer: document.getElementById("engineer").value,

        producer: document.getElementById("producer").value,

        sessionTime: document.getElementById("time").value,

        lyrics: document.getElementById("lyrics").value

    };

    socket.emit("updateData", data);

}

// Lyrics Scroll Up
function scrollUp() {
    socket.emit("lyricsScroll", -150);
}

// Lyrics Scroll Down
function scrollDown() {
    socket.emit("lyricsScroll", 150);
}