const { io } = require("socket.io-client");
const { exec } = require("child_process");

const socket = io("https://ferris-wheel-dashboard.onrender.com");

socket.on("connect", () => {
    console.log("Connected to Render");

    socket.emit("registerMac");
});

socket.on("showSessionView", () => {

    console.log("Opening Ableton...");

    exec(
        `osascript -e 'tell application "Ableton Live 12 Suite" to activate'`,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );

});

socket.on("showDashboard", () => {

    console.log("Opening Dashboard...");

    exec(
        `osascript -e 'tell application "Google Chrome" to activate'`,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );

});