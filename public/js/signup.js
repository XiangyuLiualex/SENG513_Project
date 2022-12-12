

async function sendRequest(){
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
            window.location.href = 'homepage.html'+'?userName='+usernameIn;
        }else{
            alert(data['content']);
        }
        console.log(data);
    });
}