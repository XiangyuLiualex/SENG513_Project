// For room in database
// Room id (value will be text)-Primary key
// Other Values:
// openStatus - text
// publicStatus - text
// owner - text(which is the username)
// canvasHistory - text ( from JSON.stringnify() )


function getUsername(){
    let queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get("username"))
    return urlParams.get("username")
}

async function createPublicRoom(){
    console.log("creating room");
    let roomID = makeid(4);
    let openStatus = 1;
    let publicStatus = 1;
    let owner = getUsername();
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
    window.location.href = '../html/clientCanvas.html'+'?owner='+owner+'&roomID='+roomID;
}

async function createPrivateRoom(){
    let roomID = makeid(4);
    let openStatus = 1;
    let publicStatus = 0;
    let owner = getUsername();
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
    window.location.href = '../html/clientCanvas.html'+'?owner='+owner+'&roomID='+roomID;

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




