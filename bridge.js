const { io } = require("socket.io-client");
const { exec } = require("child_process");
const fetch = require("node-fetch");

const socket = io("https://ferris-wheel-dashboard.onrender.com");

socket.on("connect", () => {
    console.log("Connected to Render");
    socket.emit("registerMac");
});socket.onAny((event, ...args) => {
    console.log("EVENT:", event, args);
});

socket.on("showSessionView", () => {

    console.log("Opening Ableton...");

    exec(
        `osascript -e 'tell application "Ableton Live 12 Suite" to activate'`,
        (err) => {
            if (err) console.error(err);
        }
    );

});

socket.on("showDashboard", () => {

    console.log("Opening Dashboard...");

    exec(
        `osascript -e 'tell application "Google Chrome" to activate'`,
        (err) => {
            if (err) console.error(err);
        }
    );

});

// Refreshment Notification
socket.on("refreshmentRequest", async (data) => {

    console.log("Refreshment received:", data);

    try {

        await fetch("https://ntfy.sh/ferris-wheel-studios", {
            method: "POST",
            body: `${data.type} Request\n\nFrom: ${data.artist}`
        });

        console.log("Refreshment Notification Sent");

    } catch (err) {

        console.error(err);

    }

});