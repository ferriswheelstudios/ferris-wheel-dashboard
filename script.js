const socket = io();

alert("script loaded");

// -----------------------------
// Dashboard Live Update
// -----------------------------

socket.on("dashboardData", (data) => {

    document.getElementById("artistName").textContent =
        data.artist || "";

    document.getElementById("songName").textContent =
        data.song || "";

    document.getElementById("engineer").textContent =
        data.engineer || "";

    document.getElementById("sessionTime").textContent =
        data.sessionTime || "";

    document.getElementById("lyricsText").innerHTML =
        (data.lyrics || "").replace(/\n/g,"<br>");

});

// -----------------------------
// Lyrics Scroll
// -----------------------------

socket.on("lyricsScroll",(amount)=>{

    const lyrics =
        document.getElementById("lyricsText");

    lyrics.scrollBy({

        top:amount,

        behavior:"smooth"

    });

});

// -----------------------------
// Live Current Time
// -----------------------------

function updateClock(){

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-IN",{

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit",

            hour12:true

        });
}

// -----------------------------
// Remaining Time Countdown
// -----------------------------

function updateRemainingTime(){

    const text = document.getElementById("sessionTime").textContent.trim();

    if(!text.includes("-")){
        document.getElementById("timer").textContent="--:--:--";
        return;
    }

    const endText = text.split("-")[1].trim();

    const match = endText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);

    if(!match){
        document.getElementById("timer").textContent="--:--:--";
        return;
    }

    let hour = parseInt(match[1],10);
    let minute = parseInt(match[2] || "0",10);
    const ampm = match[3].toUpperCase();

    if(ampm==="PM" && hour<12) hour+=12;
    if(ampm==="AM" && hour===12) hour=0;

    const now = new Date();

    const end = new Date(now);
    end.setHours(hour, minute, 0, 0);

    // Agar end time aaj ke hisaab se nikal gaya ho,
    // aur tum next-day session chahte ho to ye line use hogi.
    if(end < now){
        document.getElementById("timer").textContent="SESSION ENDED";
        return;
    }

    const diff = end - now;

    const hrs  = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById("timer").textContent =
        `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}
// Start Clock & Countdown
updateClock();
updateRemainingTime();

setInterval(() => {
    updateClock();
    updateRemainingTime();
}, 1000);