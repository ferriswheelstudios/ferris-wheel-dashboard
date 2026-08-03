const socket = io();

// Keep track of the current artist name from the dashboard,
// used as a fallback on pages (like artist.html) that have no #artist input.
let currentArtist = "";
socket.on("dashboardData", (data) => {
    currentArtist = data.artist || currentArtist;
});

// Converts a 24-hour "HH:MM" value (from <input type="time">)
// into a friendly "hh:mm AM/PM" string for the dashboard display.
function to12Hour(time24) {

    if (!time24) return "";

    const [hStr, mStr] = time24.split(":");
    let hour = parseInt(hStr, 10);
    const minute = mStr;

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return hour + ":" + minute + " " + ampm;

}

function sendData() {

    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const sessionTime =
        (startTime && endTime)
            ? (to12Hour(startTime) + " - " + to12Hour(endTime))
            : "";

    const data = {

        artist: document.getElementById("artist").value,

        song: document.getElementById("song").value,

        engineer: document.getElementById("engineer").value,

        sessionTime: sessionTime,

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