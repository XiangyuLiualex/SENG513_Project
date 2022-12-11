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
        var db = new sqlite3.Database('./public/db/userAccount.db',(err,data)=>{
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

app.get("/show_rooms/",(req,res)=>{
    var db=new sqlite3.Database("./public/db/database.db",(err)=>{
        if(!err){
            db.all('select * from rooms', (err,data)=>{
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

app.get("/subscribed_rooms/",(req,res)=>{
    var db=new sqlite3.Database("./public/db/database.db",(err)=>{
        if(!err){
            db.all('select * from subscribedRooms', (err,data)=>{
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


app.post('/subscribed_rooms/',(req,res)=>{
    console.log(req.body);
    var user = req.body;
    let ans={stat:"",content:""}
    if(user!=undefined){
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db',(err,data)=>{
            if(!err){
                let exist=false;
                db.all('select * from subscribedRooms where username = "'+user.username+'" and roomId = "'+user.roomId+'"', (err,data)=>{
                    if(!err){
                        console.log("length: "+data.length);
                        if(data.length>0){
                            exist=true;
                            console.log("stop!")
                        }
                        console.log(exist)
                        if(exist){
                            ans['stat']=0;
                            ans['content']="Already subscribed!";
                            console.log("Stop here!!!")
                            res.send(JSON.stringify(ans))
                        }else{
                            db.run('INSERT INTO subscribedRooms(username,roomId) values("'+user.username+'","'+user.roomId+'")',(err)=>{
                                if(!err){
                                    ans['stat']=1;
                                    ans['content']='Subscribed!';
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
                        console.log("buby");
                        res.send(JSON.stringify({stat:"",content:""}));
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

app.delete('/subscribed_rooms/',(req,res)=>{
    console.log(req.body);
    var user = req.body;
    let ans={stat:"",content:""}
    if(user!=undefined){
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db',(err,data)=>{
            if(!err){
                let exist=false;
                db.all('select * from subscribedRooms where username = "'+user.username+'" and roomId = "'+user.roomId+'"', (err,data)=>{
                    if(!err){
                        console.log("length: "+data.length);
                        if(data.length>0){
                            exist=true;
                            console.log("stop!")
                        }
                        console.log(exist)
                        if(exist){

                            db.run('delete from subscribedRooms where username = "'+user.username+'" and roomId = "'+user.roomId+'"',(err)=>{
                                if(!err){
                                    ans['stat']=1;
                                    ans['content']='Unsubscribed!';
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
                        else{
                            ans['stat']=0;
                            ans['content']="Error!!";
                            console.log("Stop here!!!")
                            res.send(JSON.stringify(ans))
                        }
                    }else{
                        console.log("buby");
                        res.send(JSON.stringify({stat:"",content:""}));
                        console.log("Error!!!");
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


app.listen(4000,()=>{
    console.log("your server has been started..   ");
})