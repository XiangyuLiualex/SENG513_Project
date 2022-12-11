async function sendRequest(){


    let roomIdIn = document.getElementById("roomId").value;
    console.log("sendRequest from joinRoomById.js")
    console.log("join Room with the room ID: "+ roomIdIn);

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
        // response.json().then(data => {
        response.json().then(data => {
            console.log(typeof data);
            if(data['stat']==1){
                alert("Join Room Successfully!!!");
            }else if (data['stat']==0){
                alert("Join Room fail!");
            }else if(data['stat']==69){
                alert("Room ID Invalid!");
            } 
            console.log(data);
        });





}

