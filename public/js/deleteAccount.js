//get username from URL
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
let username = urlParams.get("userName");
document.getElementById("username").innerText ="Username: "+username;
document.getElementById('go_back').addEventListener('click',()=>{
    window.location.href='management.html' + '?userName=' + username;
})
async function sendRequest(){
    let usernameIn = username;
    let passwordIn = document.getElementById("password").value;
    console.log("sendRequest from deleteAccount.js")
    console.log("DELETING User name: "+usernameIn+"\nPassword: "+passwordIn);

    const response = await fetch("/deleteAccount/", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                username: usernameIn,
                password: passwordIn,
                }),
        });
        // response.json().then(data => {
        response.json().then(data => {
            console.log(typeof data);
            if(data['stat']==1){
                alert("Deleting Account Successfully!!!");
                // go to index.html
                window.location.href = "../index.html";
            }else if (data['stat']==0){
                alert("Deleting Account Fail!");
            }else if(data['stat']==69){
                alert("You have entered wrong username or password!");
            } else{
                alert("Something went wrong!");
            }
            console.log(data);
        });





}



