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

        // let children = publicRoomsList.childNodes;
        // subscribedRoomsList.innerHTML = "";
        // const urlParams = new URLSearchParams(window.location.search);
        // const username = urlParams.get('username');
        // console.log(children);
        // if(children.length>0){
        //     for(let i = 0; i < data.length; i++){
        //         // go through each room in the public rooms list
        //         children.forEach(element => {
        //             let button = element.childNodes[0];
        //             let buttonId = button.id;
    
        //             // if the room is public and not public in the database remove it from the list
        //             if(data[i]['roomID'] == buttonId){
        //                 if(data[i]['publicStatus'] == 0){
        //                     element.remove();
        //                 }
        //             }
        
        //         });
    
        //         if(data[i]['publicStatus'] == 1) {
        //             let row = document.createElement("div");
        //             row.setAttribute("class", "row");

        //             var roomId = data[i]['roomID'];
        //             let room = document.createElement("button");
        //             room.setAttribute("class", "public-room-button");
        //             room.setAttribute("id", roomId);

        //             let roomStar = document.createElement("i");
        //             roomStar.setAttribute("class", "fa fa-star room-star");
        //             roomStar.setAttribute("id", roomId);
        //             roomStar.setAttribute("style", "font-size:2rem;");
        //             roomStar.setAttribute("aria-hidden", "false");
        //             roomStar.setAttribute("onclick", "subscribe(this)");
        //             roomStar.innerHTML="";

        //             room.innerHTML = 'Room: ' + roomId;

        //             row.appendChild(room);
        //             row.appendChild(roomStar);

        //             publicRoomsList.appendChild(row);
        //         };
        //         if(data[i]['owner'] == username){
        //             var roomId = data[i]['roomID'];
        //             let room = document.createElement("button");
        //             room.setAttribute("class", "available-room-button");
        //             room.setAttribute("id", roomId);
        //             room.innerHTML = 'Room: ' + roomId;
        //             subscribedRoomsList.appendChild(room);
        //         }
        //     }
        // }
        // else{
            //-------------------------------------------------------------
            // this block works on its own
            
            publicRoomsList.innerHTML = "";

            subscribedRoomsList.innerHTML = "";
            const urlParams = new URLSearchParams(window.location.search);
            const username = urlParams.get('username');
            for(let i=0; i < data.length; i++){
                if(data[i]['publicStatus'] == 1) {
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
            //---------------------------------------------------------------------
        // }

        // go through each room in the database
        

        
        
        
        
    });
}, 5000);


function subscribe(el){
    console.log("bubby");
    let roomStar = el;
    if(roomStar.classList.contains("room-star-selected")){
        roomStar.classList.remove("room-star-selected");
    }else{
        roomStar.classList.add("room-star-selected");
    }

}