async function sendRequest(){


    let usernameIn = document.getElementById("username").value;
    let passwordIn = document.getElementById("password").value;
    let newUsername = document.getElementById("newUsername").value;
    console.log("sendRequest from changeUsername.js")
    console.log("User name: "+usernameIn+"\nPassword: "+passwordIn+"\nNEWUsername: "+newUsername);

    const response = await fetch("/changeUsername/", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                username: usernameIn,
                password: passwordIn,
                newUsername: newUsername
                }),
        });
        // response.json().then(data => {
        response.json().then(data => {
            console.log(typeof data);
            if(data['stat']==1){
                alert("Changed Username Successfully!!!");
            }else if (data['stat']==0){
                alert("Changed Username fail!");
            }else if(data['stat']==69){
                alert("You have entered wrong username or password!");
            }else if (data['stat']==2){
                alert("Changed Username for your owned rooms successfully!");
            }else if (data['stat']==3){
                alert("Changed Username for your owned rooms failed!");
            }else if (data['stat']==5){
                alert("Sorry UserName Already Taken!");
            }  
            console.log(data);
        });





}





