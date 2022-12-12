const { rejects } = require("assert");
const { resolve } = require("path");
let sqlite3 = require("sqlite3");
let express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io,
    path = require("path");
app.use(express.json());

//provid the main page to client by get api
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
//public the codes
app.use(express.static(__dirname + '/public'));
server = http.Server(app);
server.listen(4000);//server listening to local host port 4000
io = socketIO(server);//build a scoket io server based on express http server


app.get("/create_data", (req, res) => {
    var db = new sqlite3.Database('./public/database.db', (err, data) => {
        if (!err) {
            db.run('CREATE TABLE IF NOT EXISTS users(id  integer primary key autoincrement,email text, password text)', (err) => {
                if (!err) {
                    console.log('table is created sucessfully!')
                }
                else {
                    console.log(err.message)
                }
            })
        }
    })
})


app.post('/signup', (req, res) => {
    var user = req.body;
    let ans = { stat: "", content: "" }
    if (user != undefined) {
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db', (err, data) => {
            if (!err) {
                let exist = false;
                db.all('select * from userInfo where username = "' + user.username + '"', (err, data) => {
                    if (!err) {
                        console.log("length: " + data.length);
                        if (data.length > 0) {
                            exist = true;
                            console.log("stop!")
                        }
                        console.log(exist)
                        if (exist) {
                            ans['stat'] = 0;
                            ans['content'] = "Username already";
                            console.log("Stop here!!!")
                            res.send(JSON.stringify(ans))
                        } else {
                            db.run('INSERT INTO userInfo(username,password) values("' + user.username + '","' + user.password + '")', (err) => {
                                if (!err) {
                                    ans['stat'] = 1;
                                    ans['content'] = 'Sign up successfully!';
                                    return res.send(JSON.stringify(ans))
                                }
                                else {
                                    ans['stat'] = 0;
                                    ans['content'] = 'Error!';
                                    console.log(err);
                                    return res.send(JSON.stringify(ans))
                                }
                            })
                        }
                    } else {
                        res.send("Your id is incorrect so,please check your Id....    ")
                        console.log("check you id");
                    }
                })


            }
        })
    }
    else {
        console.log('getting undefined data');
        return res.send('undefined data')
    }
})




app.post("/signin", (req, res) => {
    var password = req.body.password
    var username = req.body.username
    let ans = { stat: "", content: "" }

    console.log("email: " + username + "\npassword: " + password)
    var db = new sqlite3.Database("./public/db/database.db", (err, data) => {
        if (!err) {
            db.all('SELECT username,password FROM userInfo where username="' + username + '" and password="' + password + '"', (err, data) => {
                console.log(data)
                if (data.length == 1) {
                    ans['stat'] = 1;
                    ans['content'] = 'You are logged in successfully!';
                    return res.send(JSON.stringify(ans))
                }
                else {
                    ans['stat'] = 0;
                    ans['content'] = 'You have entered wrong username or password!';
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


app.post("/changepassword", (req, res) => {
    var password = req.body.password
    var username = req.body.username
    var newpassword = req.body.newpassword
    let ans = { stat: "", content: "" }
    //  var correctInfo = false
    //print bubby
    console.log("change password in USERDB_API.js")


    console.log("USERNAME: " + username + "\npassword: " + password + "\n newPassword: " + newpassword)
    var db = new sqlite3.Database("./public/db/database.db", (err, data) => {
        if (!err) {
            // check if the username and password is correct
            db.all('SELECT username,password FROM userInfo where username="' + username + '" and password="' + password + '"', (err, data) => {
                console.log(data)
                if (data.length == 1) {
                    let sql;
                    sql = 'UPDATE userInfo SET password = ? WHERE username = ?';
                    db.run(sql, [newpassword, username], (err) => {
                        console.log("Reset password sucessfully")
                        if (!err) {
                            // correctInfo = true;
                            ans['stat'] = 1;
                            ans['content'] = 'You have changed your password successfully!';
                            // console.error(err.message);
                            return res.send(JSON.stringify(ans))
                        } else {
                            ans['stat'] = 0;
                            ans['content'] = 'You have entered the right pasword and username, but changing failed!';
                            return res.send(JSON.stringify(ans))
                        }

                    });

                }
                else {
                    ans['stat'] = 69;
                    ans['content'] = 'You have entered wrong username or password lmao!';
                    return res.send(JSON.stringify(ans))
                }
            })
        }
    })
})




app.post("/changeUsername", (req, res) => {
    var password = req.body.password
    var username = req.body.username
    var newUsername = req.body.newUsername
    let ans = { stat: "", content: "" }

    //print bubby
    console.log("change UserName in USERDB_API.js")


    console.log("USERNAME: " + username + "\npassword: " + password + "\n newPassword: " + newUsername)
    var db = new sqlite3.Database("./public/db/database.db", (err, data) => {
        if (!err) {
            // check if the username and password is correct
            db.all('SELECT username,password FROM userInfo where username="' + username + '" and password="' + password + '"', (err, data) => {
                console.log(data)
                if (data.length == 1) {
                    // check if the new username is already taken
                    let exist = false;
                    db.all('select * from userInfo where username = "' + newUsername + '"', (err, data) => {
                        if (!err) {
                            console.log("length: " + data.length);
                            if (data.length > 0) {
                                exist = true;
                                console.log("New username found in the database!")
                            }
                            console.log(exist)
                            if (exist) {
                                ans['stat'] = 5;
                                ans['content'] = "Username already";
                                console.log("UserName Already Taken!!!")
                                res.send(JSON.stringify(ans))
                            } else {
                                // change the username in the userInfo table
                                let sql;
                                sql = 'UPDATE userInfo SET username = ? WHERE username = ?';
                                db.run(sql, [newUsername, username], (err, data) => {
                                    if (!err) {
                                        console.log("Reset Username sucessfully")
                                        ans['stat'] = 1;
                                        ans['content'] = 'You have changed your username successfully!';
                                        // console.error(err.message);
                                        return res.send(JSON.stringify(ans))
                                    } else {
                                        ans['stat'] = 0;
                                        ans['content'] = 'You have entered the right pasword and username, but changing failed!';
                                        return res.send(JSON.stringify(ans))
                                    }

                                });
                                // change the username in the rooms table
                                let sql1;
                                sql1 = 'UPDATE rooms SET owner = ? WHERE owner = ?';
                                db.run(sql1, [newUsername, username], (err, data) => {
                                    if (!err) {
                                        console.log("Reset Room Username ownership sucessfully")
                                        ans['stat'] = 2;
                                        ans['content'] = 'You have changed your username for rooms ownership successfully!';
                                        // console.error(err.message);
                                        // return res.send(JSON.stringify(ans))
                                    } else {
                                        console.log("Reset Room Username ownership Failed")
                                        //   return res.send(JSON.stringify(ans))
                                    }

                                });
                                // change the username in the subscribedRooms table
                                let sql2;
                                sql2 = 'UPDATE subscribedRooms SET username = ? WHERE username = ?';
                                db.run(sql2, [newUsername, username], (err, data) => {
                                    if (!err) {
                                        console.log("Changed Room Username in subscribedRooms table sucessfully")
                                        ans['stat'] = 2;
                                        ans['content'] = 'You have changed your username for rooms ownership successfully!';
                                        // console.error(err.message);
                                        // return res.send(JSON.stringify(ans))
                                    } else {
                                        console.log("Changed Room Username in subscribedRooms table failed")
                                        //   return res.send(JSON.stringify(ans))
                                    }

                                });

                            }
                        } else {
                            ans['stat'] = 6;
                            ans['content'] = 'finding newusername failed!';
                            console.log("checking newusername failed");
                            return res.send(JSON.stringify(ans))

                        }
                    })

                }
                else {
                    ans['stat'] = 69;
                    ans['content'] = 'You have entered wrong username or password lmao!';
                    return res.send(JSON.stringify(ans))
                }
            })
        }
    })
})


app.post("/deleteAccount", (req, res) => {
    var password = req.body.password
    var username = req.body.username
    let ans = { stat: "", content: "" }
    //print bubby
    console.log("deletingAccount in USERDB_API.js")
    console.log("Deleting account with info USERNAME: " + username + "\npassword: " + password)
    var db = new sqlite3.Database("./public/db/database.db", (err, data) => {
        if (!err) {
            // check if the username and password is correct
            db.all('SELECT username,password FROM userInfo where username="' + username + '" and password="' + password + '"', (err, data) => {
                console.log(data)
                if (data.length == 1) {
                    // delete the account from the userInfo table
                    let sql;
                    sql = 'DELETE FROM userInfo WHERE username = ?';
                    db.run(sql, [username], (err, data) => {

                        if (!err) {
                            console.log("Delete Account sucessfully")
                            ans['stat'] = 1;
                            ans['content'] = 'You have Deleted your account successfully!';
                            // console.error(err.message);
                            return res.send(JSON.stringify(ans))
                        } else {
                            console.log("Delete Account failed")
                            ans['stat'] = 0;
                            ans['content'] = 'You have entered the right pasword and username, but deleting failed!';
                            return res.send(JSON.stringify(ans))
                        }

                    });
                    // delete the account from the rooms table
                    let sql1;
                    sql1 = 'DELETE FROM rooms WHERE owner = ?';
                    db.run(sql1, [username], (err, data) => {
                        if (!err) {
                            console.log("Delete ROOMS with Account sucessfully")
                            ans['stat'] = 1;
                            ans['content'] = 'You have Deleted your account successfully!';
                            // console.error(err.message);
                            //   return res.send(JSON.stringify(ans))
                        } else {
                            console.log("Delete ROOMS with Account sucessfully")
                            ans['stat'] = 0;
                            ans['content'] = 'You have entered the right pasword and username, but deleting failed!';
                            // return res.send(JSON.stringify(ans))
                        }

                    });


                    // delete the account from the subscribedRooms table
                    let sql2;
                    sql2 = 'DELETE FROM subscribedRooms WHERE username = ?';
                    db.run(sql2, [username], (err, data) => {
                        if (!err) {
                            console.log("Delete user from subscribedRooms table sucessfully")
                            ans['stat'] = 2;
                            ans['content'] = 'You have changed your username for rooms ownership successfully!';
                            // console.error(err.message);
                            // return res.send(JSON.stringify(ans))
                        } else {
                            console.log("Delete user from subscribedRooms table failed")
                            //   return res.send(JSON.stringify(ans))
                        }

                    });

                }
                else {
                    ans['stat'] = 69;
                    ans['content'] = 'You have entered wrong username or password lmao!';
                    return res.send(JSON.stringify(ans))
                }
            })
        }
    })
})

app.post("/joinRoomById", (req, res) => {
    var roomId = req.body.roomId
    var status = 1
    let ans = { stat: "", content: "" }
    //print bubby
    console.log("joinRoomById in USERDB_API.js")
    console.log("Joining room with the room ID: " + roomId)
    var db = new sqlite3.Database("./public/db/database.db", (err, data) => {
        if (!err) {
            db.all('SELECT roomID FROM rooms where roomID="' + roomId + '" and openStatus="' + status + '"', (err, data) => {
                console.log(data)
                if (data.length == 1) {
                    console.log("Joining room sucessfully")
                    ans['stat'] = 1;
                    ans['content'] = 'found room successfully!';
                    return res.send(JSON.stringify(ans))

                }
                else {
                    console.log("Joining room failed")
                    ans['stat'] = 69;
                    ans['content'] = 'You have entered wrong roomID or the room is not open lmao!';
                    return res.send(JSON.stringify(ans))
                }
            })
        }
    })
})







app.get("/show_data", (req, res) => {
    var db = new sqlite3.Database("mydb.db", (err) => {
        if (!err) {
            db.all('select * from users', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Done");
                    res.send(data);
                }
            });
        } else {
            console.log("some error in select data")
        }
    })
})
app.get("/show_rooms/", (req, res) => {
    var db = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            db.all('select * from rooms', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Done");
                    res.send(data);
                }
            });
        } else {
            console.log("some error in select data")
        }
    })
})

app.get("/subscribed_rooms/", (req, res) => {
    var db = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            db.all('select * from subscribedRooms', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Done");
                    res.send(data);
                }
            });
        } else {
            console.log("some error in select data")
        }
    })
})


app.post('/subscribed_rooms/', (req, res) => {
    console.log(req.body);
    var user = req.body;
    let ans = { stat: "", content: "" }
    if (user != undefined) {
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db', (err, data) => {
            if (!err) {
                let exist = false;
                db.all('select * from subscribedRooms where username = "' + user.username + '" and roomId = "' + user.roomId + '"', (err, data) => {
                    if (!err) {
                        console.log("length: " + data.length);
                        if (data.length > 0) {
                            exist = true;
                            console.log("stop!")
                        }
                        console.log(exist)
                        if (exist) {
                            ans['stat'] = 0;
                            ans['content'] = "Already subscribed!";
                            console.log("Stop here!!!")
                            res.send(JSON.stringify(ans))
                        } else {
                            db.run('INSERT INTO subscribedRooms(username,roomId) values("' + user.username + '","' + user.roomId + '")', (err) => {
                                if (!err) {
                                    ans['stat'] = 1;
                                    ans['content'] = 'Subscribed!';
                                    return res.send(JSON.stringify(ans))
                                }
                                else {
                                    ans['stat'] = 0;
                                    ans['content'] = 'Error!';
                                    console.log(err);
                                    return res.send(JSON.stringify(ans))
                                }
                            })
                        }
                    } else {
                        console.log("buby");
                        res.send(JSON.stringify({ stat: "", content: "" }));
                        console.log("check you id");
                    }
                })


            }
        })
    }
    else {
        console.log('getting undefined data');
        return res.send('undefined data')
    }
})

app.delete('/subscribed_rooms/', (req, res) => {
    console.log(req.body);
    var user = req.body;
    let ans = { stat: "", content: "" }
    if (user != undefined) {
        console.log(user)
        var db = new sqlite3.Database('./public/db/database.db', (err, data) => {
            if (!err) {
                let exist = false;
                db.all('select * from subscribedRooms where username = "' + user.username + '" and roomId = "' + user.roomId + '"', (err, data) => {
                    if (!err) {
                        console.log("length: " + data.length);
                        if (data.length > 0) {
                            exist = true;
                            console.log("stop!")
                        }
                        console.log(exist)
                        if (exist) {

                            db.run('delete from subscribedRooms where username = "' + user.username + '" and roomId = "' + user.roomId + '"', (err) => {
                                if (!err) {
                                    ans['stat'] = 1;
                                    ans['content'] = 'Unsubscribed!';
                                    return res.send(JSON.stringify(ans))
                                }
                                else {
                                    ans['stat'] = 0;
                                    ans['content'] = 'Error!';
                                    console.log(err);
                                    return res.send(JSON.stringify(ans))
                                }
                            })
                        }
                        else {
                            ans['stat'] = 0;
                            ans['content'] = "Error!!";
                            console.log("Stop here!!!")
                            res.send(JSON.stringify(ans))
                        }
                    } else {
                        console.log("buby");
                        res.send(JSON.stringify({ stat: "", content: "" }));
                        console.log("Error!!!");
                    }
                })
            }
        })
    }
    else {
        console.log('getting undefined data');
        return res.send('undefined data')
    }
})
// createRoomTable
app.post("/createRoom", (req, res) => {
    var room = req.body;
    var ans = { stat: "", content: "" }
    var db = new sqlite3.Database('./public/db/database.db', (err, data) => {
        if (!err) {
            // db.run('CREATE TABLE IF NOT EXISTS rooms(roomID text primary key, openStatus text, publicStatus text , owner text, canvasHistory text)',(err)=>{
            //     if(!err){
            //         console.log('rooms table is created sucessfully!')
            //     }
            //     else{
            //         console.log(err.message)
            //     }
            //     res.send(JSON.stringify("ok"))
            // // }
            //db.run('INSERT INTO rooms values("'+room.roomID+'","'+user.password+'")',(err)=>{
            db.run('INSERT INTO rooms values("' + room.roomID + '","' + room.openStatus + '","' + room.publicStatus + '","' + room.owner + '","' + room.canvasHistory + '")', (err) => {
                if (!err) {
                    console.log("inserted!")
                    ans['stat'] = 1;
                    ans['content'] = 'create successfully!';
                    res.send(JSON.stringify(ans))
                }
                else {
                    ans['stat'] = 0;
                    ans['content'] = 'Error!';
                    console.log(err);
                    res.send(JSON.stringify(ans))
                }
            })
        }
    });
})

let db = new sqlite3.Database('./public/db/database.db');
io.on('connection', async (socket) => {
    socket.on('join', async (data) => {
        console.log('join');
        let roomID = JSON.parse(data).room;
        //join the default testing room
        socket.join(roomID);
        //sync the canvas history to new user
        let currentCanvasHistory = await getCanvasHistory(roomID);
        if (currentCanvasHistory != null) {

            socket.emit('history', currentCanvasHistory);
        }
    })

    socket.on('update', (newUpdate) => {//need to modify to multi-room version
        newUpdate = JSON.parse(newUpdate);
        let roomID = newUpdate.room;
        let data = newUpdate.data;
        io.sockets.in(roomID).emit('draw', data);
    })
    socket.on('toDB', (newCanvas) => {// need to accept room id in the future-----------------------------------------------
        newCanvas = JSON.parse(newCanvas);
        let roomID = newCanvas.room;
        let data = newCanvas.data;
        console.log(roomID);
        updateCanvasHistory(data, roomID);
    })
})

function updateCanvasHistory(canvas, roomID) {
    db.run('UPDATE rooms SET canvasHistory = ? WHERE roomID=?', [canvas, roomID], function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Room: ' + roomID + ', canvas history updated.');
        }
    })
}

function getCanvasHistory(roomID) {
    return new Promise((resolve, reject) => {
        db.get("SELECT canvasHistory FROM rooms WHERE roomID = '" + roomID + "'", function (err, data) {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                console.log('Room: ' + roomID + ',get history');
                resolve(data.canvasHistory);
            }
        })
    })


}

app.post("/management", (req, res) => {
    let userName = req.body;
    // console.log(userName.username);
    if (userName != undefined) {
        // console.log(userName.username);
        let db = new sqlite3.Database('./public/db/database.db', (err, data) => {
            if (!err) {
                //******* change */ owned_Rooms
                db.all('select roomID from rooms where owner = "' + userName.username + '"', (err, data) => {
                    if (!err) {
                        console.log("length: " + data.length);
                        res.send(JSON.stringify(data));
                    }
                })
            }
        })
    }
})

app.post("/setting", (req, res) => {
    let roomID = req.body;
    console.log(roomID);
    var db = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            db.all('select openStatus, publicStatus from rooms where roomID = "' + roomID.roomID + '"', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Done");
                    res.send(data);
                }
            });
        }
    })
})

app.post("/submitSetting", (req, res) => {
    let setting = req.body;
    var db = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            let oState, pState;
            if (setting.openStat == 0) {
                oState = 1;
            }
            else {
                oState = 0;
            }
            if (setting.publicStat == 0) {
                pState = 1;
            }
            else {
                pState = 0;
            }

            db.run('UPDATE rooms SET openStatus = "' + oState + '", publicStatus = "' + pState + '" WHERE roomID = "' + setting.roomID + '"', (err) => {
                if (!err) {
                    let ans = 1;
                    return res.send(JSON.stringify(ans));
                }
                else {
                    let ans = 0;
                    console.log(err);
                    return res.send(JSON.stringify(ans));
                }
            })
        }
    })
})

app.post("/deleteRoom", (req, res) => {
    let roomid = req.body;
    var db1 = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            db1.run('DELETE FROM rooms WHERE roomID = "' + roomid.roomID + '"', (err) => {
            })
        }
    })
    var db2 = new sqlite3.Database("./public/db/database.db", (err) => {
        if (!err) {
            // db2.all('select username from subscribedRooms where roomId = "'+roomid.roomID+'"', (err,data)=>{
            //     console.log(data);
            // });
            db2.run('DELETE FROM subscribedRooms WHERE roomId = "' + roomid.roomID + '"', (err, data) => {

            })
        }
    })

    let ans = 1;
    return res.send(JSON.stringify(ans));

})