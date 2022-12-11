async function sendRequest(){


    let usernameIn = document.getElementById("username").value;
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
            }else if (data['stat']==0){
                alert("Deleting Account Fail!");
            }else if(data['stat']==69){
                alert("You have entered wrong username or password!");
            } 
            console.log(data);
        });





}



