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
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        for(let i=0; i < data.length; i++){
            if(data[i]['publicStatus'] == 1 && data[i]['openStatus'] == 1) {
                let row = document.createElement("div");
                row.setAttribute("class", "row");

                var roomId = data[i]['roomID'];
                let room = document.createElement("button");
                room.setAttribute("class", "public-room-button");
                room.setAttribute("id", roomId);

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
                room.innerHTML = 'Room: ' + roomId;
                subscribedRoomsList.appendChild(room);
            }
        }
        
    });

    // const subscribedResponse = await fetch("/show_rooms/", {
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    // });
    // response.json().then(data => {
        
        
    // });
}, 5000);


async function subscribe(el){
    
    let roomID = el.id;
    let usernameIn = document.getElementById("username").value;
    let passwordIn = document.getElementById("password").value;
    console.log("User name: "+usernameIn+"\nPassword: "+passwordIn);

    const response = await fetch("/signup/", {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
            username: usernameIn,
            password: passwordIn
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