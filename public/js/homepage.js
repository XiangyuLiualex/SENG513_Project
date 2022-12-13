const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('userName');

//2 ways of join room
document.getElementById("join-room").addEventListener('click', async () => {
    let roomIdIn = document.getElementById("room-code").value;

    const response = await fetch("/joinRoomById/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: roomIdIn,
        }),
    });

    response.json().then(data => {
        console.log(typeof data);
        if (data['stat'] == 1) {
            alert("Join Room Successfully!!!");
            // now implement the redirect to the room
            window.location.href = "clientCanvas.html" + "?roomID=" + roomIdIn + "&userName=" + username;

        } else if (data['stat'] == 69) {
            alert("Room ID Invalid or Room is not open!");
        }
        console.log(data);
    });
})

async function joinRoom(el) {
    let roomIdIn = el.id;

    const response = await fetch("/joinRoomById/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: roomIdIn,
        }),
    });

    response.json().then(data => {
        console.log(typeof data);
        if (data['stat'] == 1) {
            alert("Join Room Successfully!!!");
            // now implement the redirect to the room
            window.location.href = "clientCanvas.html" + "?roomID=" + roomIdIn + "&userName=" + username;

        } else if (data['stat'] == 69) {
            alert("Room ID Invalid or Room is not open!");
        }
        console.log(data);
    });
}

document.getElementsByClassName("fa fa-gear btn-settings")[0].addEventListener('click', () => {
    window.location.href = "management.html" + "?userName=" + username;
})


async function createPublicRoom() {
    console.log("creating room");
    let roomID = makeid(4);
    let openStatus = 1;
    let publicStatus = 1;
    let owner = username;
    let canvasHistory = "";

    const response = await fetch("/createRoom/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "roomID": roomID,
            "openStatus": openStatus,
            "publicStatus": publicStatus,
            "owner": owner,
            "canvasHistory": canvasHistory
        })
    });

    response.json().then(data => {
        console.log(typeof data);
        console.log(data);
    });
    window.location.href = '../html/clientCanvas.html' + '?userName=' + owner + '&roomID=' + roomID;
}

async function createPrivateRoom() {
    let roomID = makeid(4);
    let openStatus = 1;
    let publicStatus = 0;
    let owner = username;
    let canvasHistory = "";

    const response = await fetch("/createRoom/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "roomID": roomID,
            "openStatus": openStatus,
            "publicStatus": publicStatus,
            "owner": owner,
            "canvasHistory": canvasHistory
        })
    });

    response.json().then(data => {
        console.log(typeof data);
        console.log(data);
    });
    window.location.href = '../html/clientCanvas.html' + '?userName=' + owner + '&roomID=' + roomID;

}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



// set a time interval to fetch data from database
fecthHomepage();
setInterval(fecthHomepage, 5000);
async function fecthHomepage() {
    console.log("fetching public rooms from database...");
    const response = await fetch("/show_rooms/", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    response.json().then(data => {
        let publicRoomsList = document.getElementById("public-rooms");
        let subscribedRoomsList = document.getElementById("subscribed-rooms");
        let starredRoomsList = document.getElementById("starred-rooms");


        publicRoomsList.innerHTML = "";
        subscribedRoomsList.innerHTML = "";
        starredRoomsList.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            if (data[i]['publicStatus'] == 1 && data[i]['openStatus'] == 1) {
                let row = document.createElement("div");
                row.setAttribute("class", "row");

                var roomId = data[i]['roomID'];
                let room = document.createElement("button");
                room.setAttribute("class", "public-room-button");
                room.setAttribute("id", roomId);
                room.setAttribute("onclick", "joinRoom(this)");

                let roomStar = document.createElement("i");
                roomStar.setAttribute("class", "fa fa-star room-star");
                roomStar.setAttribute("id", roomId);
                roomStar.setAttribute("style", "font-size:2rem;");
                roomStar.setAttribute("aria-hidden", "false");
                roomStar.setAttribute("onclick", "subscribe(this)");
                roomStar.innerHTML = "";

                room.innerHTML = 'Room: ' + roomId;

                row.appendChild(room);
                row.appendChild(roomStar);

                publicRoomsList.appendChild(row);
            };
            if (data[i]['owner'] == username) {
                var roomId = data[i]['roomID'];
                let room = document.createElement("button");
                room.setAttribute("class", "available-room-button");
                room.setAttribute("id", roomId);
                room.setAttribute("onclick", "joinRoom(this)");
                room.innerHTML = 'Room: ' + roomId;
                subscribedRoomsList.appendChild(room);
            }
        }

    });


    const subResponse = await fetch("/subscribed_rooms/", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    subResponse.json().then(data => {

        let starredRoomsList = document.getElementById("starred-rooms");
        starredRoomsList.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            if (data[i]['username'] == username) {

                let row = document.createElement("div");
                row.setAttribute("class", "row");

                var roomId = data[i]['roomId'];
                let room = document.createElement("button");
                room.setAttribute("class", "public-room-button");
                room.setAttribute("id", roomId);
                room.setAttribute("onclick", "joinRoom(this)");
                room.innerHTML = 'Room: ' + roomId;

                let roomDelete = document.createElement("i");
                roomDelete.setAttribute("class", "fa fa-trash room-trash");
                roomDelete.setAttribute("id", roomId);
                roomDelete.setAttribute("style", "font-size:2rem;");
                roomDelete.setAttribute("aria-hidden", "false");
                roomDelete.setAttribute("onclick", "unsubscribe(this)");
                roomDelete.innerHTML = "";


                row.appendChild(room);
                row.appendChild(roomDelete);

                starredRoomsList.appendChild(row);
            }
        }

    });



    // });
}

async function subscribe(el) {
    let roomId = el.id;


    console.log("User name: " + username + "\nRoom ID: " + roomId);

    const response = await fetch("/subscribed_rooms/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            roomId: roomId
        }),
    });
    // response.json().then(data => {
    response.json().then(data => {
        console.log(typeof data);
        if (data['stat'] == 1) {
            alert(data['content']);
            fecthHomepage();
        } else {
            alert(data['content']);
        }
        console.log(data);
    });
}

async function unsubscribe(el) {
    let roomId = el.id;

    const response = await fetch("/subscribed_rooms/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            roomId: roomId
        }),
    });
    // response.json().then(data => {
    response.json().then(data => {
        console.log(typeof data);
        if (data['stat'] == 1) {
            alert(data['content']);
            fecthHomepage();
        } else {
            alert(data['content']);
        }
        console.log(data);
    });

}
