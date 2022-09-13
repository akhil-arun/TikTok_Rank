// index.js
// This is our main server file

// include express
const express = require("express");
const fetch = require("cross-fetch");

const bodyParser = require('body-parser');

// create object to interface with express
const app = express();
const db = require('./public/sqlWrap');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

// make all the files in 'public' available 
app.use(express.static("public"));

// a module that gets json out of the request body; not needed yet, but very useful!
app.use(express.json());

// gets text out of the HTTP body and into req.body
app.use(bodyParser.text());

// if no file specified, return the main page
// New main page is My Videos according to updated assignment prompt (Part 10)
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myvideos.html");
  console.log(__dirname + "/public/myvideos.html");
});

// This is where the server recieves and responds to the videoData POST request
app.post('/videoData', function(req, res, next) {
  console.log("Server recieved a post request at", req.url);
  let text = req.body;
  console.log("It contained this string:", text);
  // NEW
  insertVideo(text)
  .then(function(result){
    console.log("Server says: ", result);
    res.send(result);
  })
  .catch(function(err){
    console.log("Error: ", err);
  });
  // End NEW
        
  //res.send(text);
});

app.post('/deleteVid', function(req, res, next) {
  console.log("Server recieved a post request at", req.url);
  let vidName = req.body;
  console.log("It contained this string:", vidName); 
  deleteVid(vidName)
  .then(function(result){
    console.log("Server says: ", result);
    res.send("success");
  })
  .catch(function(err){
    console.log("Error: ", err);
  });
  //res.send(text);
});




// GET Request for most recent video
app.get('/getMostRecent', function(req,res,next){
  console.log("Server received a get request at", req.url);
  getMostRecentVid()
  .then(function(result){
    console.log("Server is sending: ", result);
    res.send(JSON.stringify(result));
  })
  .catch(function(err){
    console.log("Error: ", err);
  });
});

// GET Request for all nicknames
app.get("/getList", (req,res,next) => {
  console.log("Server received a get request at", req.url);
  dumpNicknames()
  .then(function(result){
    console.log("Server is sending: ", result);
    res.send(JSON.stringify(result));
  })
  .catch(function(err){
    console.log("Error: ", err);
  })
});


// if no page is found
app.use(function(req, res) { 
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found');
});
// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

// NEW ******************
//Insert new video into database if space permits
async function insertVideo(combined_data){
 
  let numVideos = await dumpTable();
  let n = numVideos.length;
  console.log("Videos currently in database: ", n);
  if ( n >= 8){ 
    return "Database Full";
  }
  else{
    let sql = "UPDATE VideoTable SET flag = FALSE where flag = TRUE ";
    await db.run(sql);
    sql= "INSERT INTO VideoTable VALUES (?,?,?, TRUE)";
    await db.run(sql,[combined_data.user, combined_data.url,combined_data.nickname]);
    return "More Space";   
  }
  
}

// get the most recently inserted video from the database
async function getMostRecentVid(){
  const sql = "SELECT userid, url, nickname FROM VideoTable WHERE flag = TRUE ";
  let video_info = await db.get(sql);
  return video_info;
}

async function dumpTable(){
  const sql = "SELECT * FROM VideoTable";
  let allVideos = await db.all(sql);
  return allVideos;
}

async function dumpNicknames(){
  const sql = "SELECT nickname FROM VideoTable";
  let allVideos = await db.all(sql);
  return allVideos;
}

async function deleteVid(video_name){
  const sql = "DELETE FROM VideoTable WHERE nickname = ?";
  await db.run(sql, [video_name]);
}
