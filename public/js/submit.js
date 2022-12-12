//get change values from URL
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
let roomID = urlParams.get("roomID");
let openStat = urlParams.get("openStat");
let publicStat = urlParams.get("publicStat");
let del = urlParams.get("delete");
let username = urlParams.get("userName");

// console.log(roomID);
// console.log(openStat);
// console.log(publicStat);
// console.log(del);

async function sendRequest(){
    if(del != 1) {
        const response = await fetch("/submitSetting/", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomID: roomID,
                openStat: openStat,
                publicStat: publicStat
                    }),
            });
            // response.json().then(data => {
            response.json().then(data => {
                console.log(data);
                if(data == 1) {
                    alert("Successfully change the settings!!");
                    window.location.href = 'management.html' + '?userName=' + username;
                }
                else {
                    alert("Can't change the settings!!");
                    window.location.href = 'management.html' + '?userName=' + username;
                }
                
            });
    }
    else {
        const response = await fetch("/deleteRoom/", {
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
                if(data == 1) {
                    alert("Successfully deleted the room!!");
                    window.location.href = 'management.html' + '?userName=' + username;
                }
                else {
                    alert("Can't delete the room!!");
                    window.location.href = 'management.html' + '?userName=' + username;
                }
             
            });
    }
}
sendRequest();

// if(del != 1) {
//     alert("Successfully change the settings!!");
//     window.location.href = 'management.html' + '?username=' + username;
       
// }
// else {
    
//     alert("Successfully deleted the room!!");
//     window.location.href = 'management.html'+ '?username=' + username;

// }