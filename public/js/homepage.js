const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

document.getElementById("join-room").addEventListener('click',()=>{
    let roomID = document.getElementById("room-code").value;
    window.location.href = "clientCanvas.html"+"?roomID="+roomID+"&userName="+username;
})

async function createPublicRoom(){
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
            "openStatus" : openStatus,
            "publicStatus" : publicStatus,
            "owner" : owner,
            "canvasHistory" : canvasHistory
        })
        });

    response.json().then(data => {
        console.log(typeof data);
        console.log(data);
    });
    window.location.href = '../html/clientCanvas.html'+'?username='+owner+'&roomID='+roomID;
}

async function createPrivateRoom(){
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
            "openStatus" : openStatus,
            "publicStatus" : publicStatus,
            "owner" : owner,
            "canvasHistory" : canvasHistory
        })
        });

    response.json().then(data => {
        console.log(typeof data);
        console.log(data);
    });
    window.location.href = '../html/clientCanvas.html'+'?username='+owner+'&roomID='+roomID;

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
setInterval(async function(){
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
        for(let i=0; i < data.length; i++){
            if(data[i]['publicStatus'] == 1 && data[i]['openStatus'] == 1) {
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
                roomStar.innerHTML="";

                room.innerHTML = 'Room: ' + roomId;

                row.appendChild(room);
                row.appendChild(roomStar);

                publicRoomsList.appendChild(row);
            };
            if(data[i]['owner'] == username){
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

        for(let i=0; i < data.length; i++){
            if(data[i]['username'] == username){

                let row = document.createElement("div");
                row.setAttribute("class", "row");

                var roomId = data[i]['roomID'];
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
                roomDelete.innerHTML="";


                row.appendChild(room);
                row.appendChild(roomDelete);

                starredRoomsList.appendChild(row);
            }
        }
        
    });
    
        
        
    // });
}, 5000);


function joinRoom(el){
    const roomId = el.id;
    window.location.href = "clientCanvas.html"+"?roomID="+roomId+"&userName="+username;
}

async function subscribe(el){

    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');
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
        if(data['stat']==1){
            alert(data['content']);
        }else{
            alert(data['content']);
        }
        console.log(data);
    });
}

async function unsubscribe(el){
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
            if(data['stat']==1){
                alert(data['content']);
            }else{
                alert(data['content']);
            }
            console.log(data);
        });

}
