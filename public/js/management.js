// get username from URL
// let urlString = window.location.search;
// let urlParams = new URLSearchParams(urlString);
// let username = urlParams.get("userName");

//Testing
let username = "Alex";

let owned_Rooms;

//Testing
owned_Rooms = ["123", "234", "456", "567", "888", "999"];

let u = document.getElementById("user_name");
let r = document.getElementById("rooms");
u.innerText = username;

// async function sendRequest(){
//     const response = await fetch("/management/", {
//     method: 'GET',
//     headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//             username: username
//             }),
//     });
//     // response.json().then(data => {
//     response.json().then(data => {
//         console.log(data);
//         owned_Rooms = data;
//         displayOwnedRooms();
//     });
// }

function displayOwnedRooms() {
    let l = document.createElement("ul");
    let n = owned_Rooms.length;
    let i;
    for(i = 1; i < (n+1); i++) {
        let rID = owned_Rooms[i-1];
        let li = document.createElement("li");
        let str = 'Room ' + i + ': ' + owned_Rooms[i-1];
        li.innerText = str;
        li.style.fontSize = "25px";
        li.onclick = function () {
            window.location.href='setting.html' + '?roomID=' + rID + '&username=' + username;
            // console.log('setting.html' + '?roomID=' + rID);
        };
        if(i % 2 == 0) {
            li.style.backgroundColor = "#BCBCBC";
        }
        else {
            li.style.backgroundColor = "#949494";
        }
        
        li.style.listStyleImage = "url(../images/room_icon.png)";
        l.appendChild(li);
    }
    r.appendChild(l);
}

// need to comment out
displayOwnedRooms();