// 需要从db里找出button对应room的信息
const room = document.getElementById("but");

const manage = document.getElementById("manageMyRoom");

let joinRoom = document.getElementById("joinRoom"), deleteRoom = document.getElementById("delete"), clo = document.getElementById("close");
let pub = document.getElementById("public"), pri = document.getElementById("private"), op = document.getElementById("open"), cld = document.getElementById("closed");

room.addEventListener("click", () => {
    mangeMyRoom;
});

function mangeMyRoom() {
    // hide the original elements
    room.style.display = none; 
    // show manage 
    manage.style.display = block;

    joinRoom.addEventListener("click", joinroom);
    deleteRoom.addEventListener("click", deleteroom);
    clo.addEventListener("click", closeManage);
    pub.addEventListener("click", changeToPublic);
    pri.addEventListener("click", changeToPrivate);
    op.addEventListener("click", changeToOpen);
    cld.addEventListener("click", changeToClosed);
}

function joinroom() {

}

function deleteroom() {

}

function closeManage() {
    joinRoom.removeEventListener("click", joinroom, false);
    deleteRoom.removeEventListener("click", deleteroom, false);
    clo.removeEventListener("click", closeManage, false);
    // show the original elements
    room.style.display = block; 
    // hide manage 
    manage.style.display = none;
}

function changeToPublic() {

}

function changeToPrivate() {

}

function changeToOpen() {

}

function changeToClosed() {

}
