// Reference https://www.geeksforgeeks.org/how-to-reset-change-password-in-node-js-with-passport-js/



// const express = require('express')
// const bodyParser = require('body-parser')
// const mongoose = require("mongoose");
// const passport = require("passport");
// const passportLocalMongoose 
//     = require("passport-local-mongoose");
  
// mongoose.connect(
// "mongodb://localhost:27017/passport-forget", {
//     useNewUrlParser: true
// });
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
    let newpasswordIn = document.getElementById("newPassword").value;
    console.log("sendRequest from changePassword.js")
    console.log("User name: "+usernameIn+"\nPassword: "+passwordIn+"\nNEWPassword: "+newpasswordIn);

    const response = await fetch("/changepassword/", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                username: usernameIn,
                password: passwordIn,
                newpassword: newpasswordIn
                }),
        });
        // response.json().then(data => {
        response.json().then(data => {
            console.log(typeof data);
            if(data['stat']==1){
                alert("Changed Password Successfully!!!");
            }else if (data['stat']==0){
                alert("Changed Password fail!");
            }else if(data['stat']==69){
                alert("You have entered wrong username or password!");
            } 
            console.log(data);
        });





}
















// const app = express()
  
// app.use(passport.initialize());
  
// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
// });
  
// userSchema.plugin(passportLocalMongoose);
  
// const User = new mongoose.model("User", userSchema);
  
// passport.use(User.createStrategy());
  
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });
  
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });
  
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
  
// // app.get('/register', function (req, res) {
// //     res.sendFile('register.html', {
// //         root: __dirname
// //     });
// // });
  
// app.get('/changepassword', function (req, res) {
//     res.sendFile('changepassword.html', {
//         root: __dirname
//     });
// });
  
// app.post('/register', function (req, res) {
//     User.register({
//         username: req.body.username
//     }, req.body.password, function (err) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send('successfully registered')
//         }
//     });
// });


// app.post('/changepassword', function (req, res) {
//     User.findByUsername(req.body.username, (err, user) => {
//         if (err) {
//             res.send(err);
//         } else {
//             user.changePassword(req.body.oldpassword, 
//             req.body.newpassword, function (err) {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.send('successfully change password')
//                 }
//             });
//         }
//     });
// });
  
  
