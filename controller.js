const socket = io();

// Keep track of the current artist name from the dashboard,
// used as a fallback on pages (like artist.html) that have no #artist input.
let currentArtist = "";
socket.on("dashboardData", (data) => {
    currentArtist = data.artist || currentArtist;
});

function sendData() {

    const data = {

        artist: document.getElementById("artist").value,

        song: document.getElementById("song").value,

        engineer: document.getElementById("engineer").value,

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

function showSessionView() {
    socket.emit("showSessionView");
}

function showDashboard() {
    socket.emit("showDashboard");
}

// -------------------------
// Refreshment Request
// -------------------------
function requestRefreshment(type) {

    const artistInput = document.getElementById("artist");
    const artist = artistInput ? artistInput.value : currentArtist;

    console.log("Sending Refreshment:", artist, type);

    socket.emit("refreshmentRequest", {
        artist: artist,
        type: type
    });

}