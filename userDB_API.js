var sqlite3 = require("sqlite3");
var express= require("express");
let path=require("path");
// exports.static = require('serve-static');

var app=express();
app.use(express.json());

//provid the main page to client by get api
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
//public the codes
app.use(express.static(__dirname + '/public'));

app.get("/create_data",(req,res)=>{
    var db = new sqlite3.Database('./public/mydb.db',(err,data)=>{
        if(!err){
            db.run('CREATE TABLE IF NOT EXISTS users(id  integer primary key autoincrement,email text, password text)',(err)=>{
                if(!err){
                        console.log('table is created sucessfully!')
                }
                else{
                    console.log(err.message)
                }
            })
        }
    })
})


app.post('/signup',(req,res)=>{
    var user = req.body;
    let ans={stat:"",content:""}
    if(user!=undefined){
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db',(err,data)=>{
            if(!err){
                let exist=false;
                db.all('select * from userInfo where username = "'+user.username+'"', (err,data)=>{
                    if(!err){
                        console.log("length: "+data.length);
                        if(data.length>0){
                            exist=true;
                            console.log("stop!")
                        }
                        console.log(exist)
                    if(exist){
                        ans['stat']=0;
                        ans['content']="Username already";
                        console.log("Stop here!!!")
                        res.send(JSON.stringify(ans))
                    }else{
                        db.run('INSERT INTO userInfo(username,password) values("'+user.username+'","'+user.password+'")',(err)=>{
                            if(!err){
                                ans['stat']=1;
                                ans['content']='Sign up successfully!';
                                return res.send(JSON.stringify(ans))
                                }
                            else{
                                ans['stat']=0;
                                ans['content']='Error!';
                                console.log(err);
                                return res.send(JSON.stringify(ans))
                            }
                        })
                    }
                    }else{
                        res.send("Your id is incorrect so,please check your Id....    ")
                        console.log("check you id");
                    }
                })

                
                }
            })
    }
    else{
        console.log('getting undefined data');
        return res.send('undefined data')
    }
})




app.post("/signin",(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    let ans={stat:"",content:""}

    console.log("email: "+username+"\npassword: "+password)
    var db= new sqlite3.Database("./public/db/database.db",(err,data)=>{
       if(!err){
           db.all('SELECT username,password FROM userInfo where username="'+username+'" and password="'+password+'"',(err,data)=>{
                console.log(data)
               if(data.length==1){
                    ans['stat']=1;
                    ans['content']='You are logged in successfully!';
                   return res.send(JSON.stringify(ans))
               }
               else{
                    ans['stat']=0;
                    ans['content']='You have entered wrong username or password!';
                   return res.send(JSON.stringify(ans))
               }
           })
       }
    })
})


// app.put("/forgotpassword",(req,res)=>{
//     var password=req.body.password
//     var email=req.body.email
//     var db=new sqlite3.Database("mydb.db",(err,data)=>{
//         if(!err){
//             db.run('update users set password="'+password+'"where email="'+email+'"',(err)=>{
//                 return res.send("updated sucessfully")
//             })
//         }else {
//             return res.send("not updated sucessfully")
//         }
//     })
// }) 


// app.get('/changepassword', function (req, res) {
//     res.sendFile('changePassword.html', {
//         root: __dirname
//     });
//  });


app.post("/changepassword",(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    var newpassword=req.body.newpassword
    let ans={stat:"",content:""}
  //  var correctInfo = false
    //print bubby
    console.log("change password in USERDB_API.js")
    

    console.log("USERNAME: "+username+"\npassword: "+password+"\n newPassword: "+newpassword)
    var db= new sqlite3.Database("./public/db/database.db",(err,data)=>{
       if(!err){
            db.all('SELECT username,password FROM userInfo where username="'+username+'" and password="'+password+'"',(err,data)=>{
                console.log(data)
               if(data.length==1){
                let sql;
                sql = 'UPDATE userInfo SET password = ? WHERE username = ?';
                db.run(sql, [newpassword, username], (err) => {
                    console.log("Reset password sucessfully")
                    if(!err){
                       // correctInfo = true;
                        ans['stat']=1;
                        ans['content']='You have changed your password successfully!';
                       // console.error(err.message);
                        return res.send(JSON.stringify(ans))
                    }else {
                        ans['stat']=0;
                        ans['content']='You have entered the right pasword and username, but changing failed!';
                        return res.send(JSON.stringify(ans))
                    }
                  
               });
                    
               }
               else {
                    ans['stat']=69;
                    ans['content']='You have entered wrong username or password lmao!';
                   return res.send(JSON.stringify(ans))
               }
           })
       }
    })
})




app.post("/changeUsername",(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    var newUsername=req.body.newUsername
    let ans={stat:"",content:""}
    
    //print bubby
    console.log("change UserName in USERDB_API.js")
    

    console.log("USERNAME: "+username+"\npassword: "+password+"\n newPassword: "+newUsername)
    var db= new sqlite3.Database("./public/db/database.db",(err,data)=>{
       if(!err){
            db.all('SELECT username,password FROM userInfo where username="'+username+'" and password="'+password+'"',(err,data)=>{
                console.log(data)
               if(data.length==1){

                let exist=false;
                db.all('select * from userInfo where username = "'+newUsername+'"', (err,data)=>{
                    if(!err){
                        console.log("length: "+data.length);
                        if(data.length>0){
                            exist=true;
                            console.log("New username found in the database!")
                        }
                        console.log(exist)
                    if(exist){
                        ans['stat']=5;
                        ans['content']="Username already";
                        console.log("UserName Already Taken!!!")
                        res.send(JSON.stringify(ans))
                    }else{
                        let sql;
                        sql = 'UPDATE userInfo SET username = ? WHERE username = ?';
                        db.run(sql, [newUsername, username], (err,data) => {
                            if(!err){
                                console.log("Reset Username sucessfully")
                                ans['stat']=1;
                                ans['content']='You have changed your username successfully!';
                               // console.error(err.message);
                                return res.send(JSON.stringify(ans))
                            }else{
                                ans['stat']=0;
                                ans['content']='You have entered the right pasword and username, but changing failed!';
                                return res.send(JSON.stringify(ans))
                            }
                          
                       });

                       let sql1;
                       sql1 = 'UPDATE rooms SET owner = ? WHERE owner = ?';
                       db.run(sql1, [newUsername, username], (err,data) => {
                        if(!err){
                            console.log("Reset Room Username ownership sucessfully")
                            ans['stat']=2;
                            ans['content']='You have changed your username for rooms ownership successfully!';
                           // console.error(err.message);
                           // return res.send(JSON.stringify(ans))
                        }else{
                            console.log("Reset Room Username ownership Failed")
                         //   return res.send(JSON.stringify(ans))
                        }
        
                       });  
                        
                    }
                    }else{
                        ans['stat']=6;
                        ans['content']='finding newusername failed!';
                        console.log("checking newusername failed");
                        return res.send(JSON.stringify(ans))
                        
                    }
                })
  
               }
               else{
                    ans['stat']=69;
                    ans['content']='You have entered wrong username or password lmao!';
                   return res.send(JSON.stringify(ans))
               }
           })
       }
    })
})


app.post("/deleteAccount",(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    let ans={stat:"",content:""}
    //print bubby
    console.log("deletingAccount in USERDB_API.js")
    console.log("Deleting account with info USERNAME: "+username+"\npassword: "+password)
    var db= new sqlite3.Database("./public/db/database.db",(err,data)=>{
       if(!err){
            db.all('SELECT username,password FROM userInfo where username="'+username+'" and password="'+password+'"',(err,data)=>{
                console.log(data)
               if(data.length==1){
                let sql;
                sql = 'DELETE FROM userInfo WHERE username = ?';
                db.run(sql, [username], (err,data) => {
                    console.log("Delete Account sucessfully")
                    if(!err){
                        ans['stat']=1;
                        ans['content']='You have Deleted your account successfully!';
                       // console.error(err.message);
                        return res.send(JSON.stringify(ans))
                    }else{
                        ans['stat']=0;
                        ans['content']='You have entered the right pasword and username, but deleting failed!';
                        return res.send(JSON.stringify(ans))
                    }
                  
               });
                    
               }
               else{
                    ans['stat']=69;
                    ans['content']='You have entered wrong username or password lmao!';
                   return res.send(JSON.stringify(ans))
               }
           })
       }
    })
})

app.post("/joinRoomById",(req,res)=>{
    var roomId=req.body.roomId
    var status= 1
    let ans={stat:"",content:""}
    //print bubby
    console.log("joinRoomById in USERDB_API.js")
    console.log("Joining room with the room ID: "+roomId)
    var db= new sqlite3.Database("./public/db/database.db",(err,data)=>{
       if(!err){
            db.all('SELECT roomID FROM rooms where roomID="'+roomId+'" and openStatus="'+status+'"',(err,data)=>{
                console.log(data)
               if(data.length==1){
                console.log("Joining room sucessfully")
                ans['stat']=1;
                ans['content']='found room successfully!';
                return res.send(JSON.stringify(ans))
                    
               }
               else{
                console.log("Joining room failed")
                    ans['stat']=69;
                    ans['content']='You have entered wrong roomID or the room is not open lmao!';
                   return res.send(JSON.stringify(ans))
               }
           })
       }
    })
})







app.get("/show_data",(req,res)=>{
    var db=new sqlite3.Database("mydb.db",(err)=>{
        if(!err){
            db.all('select * from users', (err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Done");
                    res.send(data);
                }
            });
        }else{
            console.log("some error in select data")
        }
    })
})





app.listen(4000,()=>{
    console.log("your server has been started..   ");
})