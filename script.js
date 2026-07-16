const socket = io();

let sessionEnd = null;

// =====================
// Dashboard Live Update
// =====================

socket.on("dashboardData",(data)=>{

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

    calculateSessionEnd();

});

// =====================
// Lyrics Scroll
// =====================

socket.on("lyricsScroll",(amount)=>{

    document.getElementById("lyricsContainer").scrollBy({
        top:amount,
        behavior:"smooth"
    });

});

// =====================
// Live Clock
// =====================

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

// =====================
// Session End Time
// =====================

function calculateSessionEnd(){

    const text =
        document.getElementById("sessionTime").textContent.trim();

    if(!text.includes("-")){
        sessionEnd = null;
        return;
    }

    const endText = text.split("-")[1].trim();

    const match =
        endText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if(!match){
        sessionEnd = null;
        return;
    }

    let hour = parseInt(match[1]);
    let minute = parseInt(match[2]);
    let ampm = match[3].toUpperCase();

    if(ampm==="PM" && hour!==12) hour+=12;
    if(ampm==="AM" && hour===12) hour=0;

    sessionEnd = new Date();

    sessionEnd.setHours(hour);
    sessionEnd.setMinutes(minute);
    sessionEnd.setSeconds(0);

}

// =====================
// Remaining Timer
// =====================

function updateRemaining(){

    if(!sessionEnd){

        document.getElementById("timer").textContent =
        "--:--:--";

        return;
    }

    let diff = sessionEnd - new Date();

    if(diff<0){

        document.getElementById("timer").textContent =
        "SESSION ENDED";

        return;
    }

    let hrs =
        Math.floor(diff/3600000);

    let mins =
        Math.floor((diff%3600000)/60000);

    let secs =
        Math.floor((diff%60000)/1000);

    document.getElementById("timer").textContent =
        String(hrs).padStart(2,"0")+":"+
        String(mins).padStart(2,"0")+":"+
        String(secs).padStart(2,"0");

}

// =====================

updateClock();

setInterval(updateClock,1000);

setInterval(updateRemaining,1000);