//get roomID from URL
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
let roomID = urlParams.get("roomID");
let username = urlParams.get("userName");

// console.log(roomID);

// 0: public, open; 1: private, closed
let visi = 0, stat = 0;
// del = 1 means delete the room
let del = 0;

// room id
let r = document.getElementById("user_name");
let v = document.getElementById("visi");
let pub_but = document.getElementById("public");
let pri_but = document.getElementById("private");
let s = document.getElementById("stat");
let open_but = document.getElementById("open");
let clos_but = document.getElementById("closed");
let d = document.getElementById("del");
let del_but = document.getElementById("dele_butt");
let sub_but = document.getElementById("subm_butt");
let back = document.getElementsByClassName("butt2")[0];

r.innerText = roomID;

let roomInfo;

async function sendRequest(){
    const response = await fetch("/setting/", {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            roomID: roomID
            }),
    });
    // response.json().then(data => {
    response.json().then(data => {
        console.log(data);
        roomInfo = data;
        console.log(roomInfo[0].openStatus);
        if(roomInfo[0].openStatus == 1) {
            stat = 0;
            s.innerText = "Open";
        }
        else {
            stat = 1;
            s.innerText = "Closed";
        }
        console.log(roomInfo[0].publicStatus);
        if(roomInfo[0].publicStatus == 1) {
            visi = 0;
            v.innerText = "Public";
        }
        else {
            visi = 1;
            v.innerText = "Private";
        }
        console.log(stat);
        console.log(visi);
    });
}
sendRequest();
// //testing 
// v.innerText = "Public";
// visi = 0;
// s.innerText = "Open";
// stat = 0;

back.addEventListener("click", function() {
    window.location.href = 'management.html' + '?userName=' + username;
})

pub_but.addEventListener("click", function() {
    visi = 0;
    v.innerText = "Public";
    v.style.color = "crimson";
})

pri_but.addEventListener("click", function() {
    visi = 1;
    v.innerText = "Private";
    v.style.color = "crimson";
})

open_but.addEventListener("click", function() {
    stat = 0;
    s.innerText = "Open";
    s.style.color = "crimson";
})

// ADD: ask all the sockets leave the rooms
clos_but.addEventListener("click", function() {
    stat = 1;
    s.innerText = "Closed";
    s.style.color = "crimson";
})

//ASK all the sockets leave the rooms
del_but.addEventListener("click", function() {
    del = 1;
    d.innerText = "YES!";
    d.style.color = "crimson";
})

sub_but.addEventListener("click", function () {
    window.location.href = 'submitSetting.html' + '?roomID=' + roomID + '&openStat=' + stat + '&publicStat=' + visi + '&delete=' + del + '&userName=' + username;
})