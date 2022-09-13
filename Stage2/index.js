'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  //console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

app.get("/getTwoVideos", async function(req, res){
  console.log("Server received a get request at", req.url);
  try{
    let result = await getTwo();
    console.log("Server is sending: ", result);

    res.send(JSON.stringify(result));
  }
  catch(err){
    console.log("Error: ", err);
  }
  
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);
  let bestVid = await getBest(winner);
  console.log(bestVid);
  

  // you'll need to send back a more meaningful response here.
  res.json(bestVid);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.post("/insertPref", async function (req, res){
   console.log("Server received a post request at", req.url);
   let pref = req.body;
   console.log(pref);
   try{
     await win.insertPreference(pref.better, pref.worse);
     let all_prefs = await win.getAllPrefs();
     let numPrefs = all_prefs.length;
     console.log("# of prefs = ", numPrefs);
     if(numPrefs < 15){
       res.send("Continue");
     }
     else{
       res.send("Pick Winner");
     }
   }
   catch(err){
     console.log("Error: ", err)
   }
});


// Page not found
app.use(function(req, res){
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

async function getTwo(){
  const sql = " SELECT * FROM VideoTable Order By Random() LIMIT 2";

  return db.all(sql);
}

async function getBest(best){
  const sql = "SELECT *FROM VideoTable Where rowIdNum = ?";
  return db.get(sql,[best]);
}
