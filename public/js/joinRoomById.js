async function sendRequest(){
    let roomIdIn = document.getElementById("roomId").value;
    let username = document.getElementById("username").value;
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
       
        response.json().then(data => {
            console.log(typeof data);
            if(data['stat']==1){
                alert("Join Room Successfully!!!");
                // now implement the redirect to the room
                window.location.href = "clientCanvas.html"+"?roomID="+roomIdIn+"&userName="+username;

        
            }else if(data['stat']==69){
                alert("Room ID Invalid or Room is not open!");
            } 
            console.log(data);
        });
}

