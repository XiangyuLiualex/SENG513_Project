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

        publicRoomsList.innerHTML = "";
        subscribedRoomsList.innerHTML = "";

        for(let i=0; i < data.length; i++){
            if(data[i]['publicStatus'] == 1) {
                var roomId = data[i]['roomID'];
                let room = document.createElement("button");
                room.setAttribute("class", "available-room-button");
                room.setAttribute("id", roomId);
                room.innerHTML = 'Room: ' + roomId;
                publicRoomsList.appendChild(room);
            };
        }
    });
}, 1000);
