"use strict";

async function sendPostRequest(url, data) {
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

// My Videos Listener
var vids = document.getElementById('myvideos');
vids.addEventListener("click", event => {
  window.location = "/myvideos.html";
});


// Continue Listener

var cont = document.getElementById('continue');
  
cont.addEventListener("click", event => {
  /*var user = document.getElementById('username').value;
  var url = document.getElementById('tiktokurl').value;
  var nickname = document.getElementById('videoname').value;
  var combined_data = user+url+nickname;*/
  let combined_data = {
    "user" : document.getElementById('username').value,
    "url" : document.getElementById('tiktokurl').value,
    "nickname" : document.getElementById('videoname').value
  };
  
  let combined_dataJSON = JSON.stringify(combined_data);
  console.log("Attempting to send server", combined_dataJSON); 
  
  sendPostRequest('/videoData', combined_dataJSON)
  .then(function (data) {
    console.log("Server says:", data);
    if(data === "Database Full"){
      alert("The Database is Full!");  
      document.getElementById('continue').style.visibility = 'hidden';
    }
    else {
       window.location = "/videopreview.html";
    }
  })
  .catch(function (error) {
     console.error('Error:', error);
  });
});
