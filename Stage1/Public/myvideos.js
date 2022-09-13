// GET LOGIC -> This is for loading all the videos
let add_new = document.getElementById('addnew');
let play_game = document.getElementById('playgame');
play_game.disabled = true;
add_new.disabled = false;

add_new.addEventListener("click", event => {
  console.log("Button was clicked");
  window.location = "/tiktokpets.html";
});

async function sendGetRequest(url){
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  if (response.ok){
    let data = await response.text();
    return data;
  }
  else{
    throw Error(response.status);
  }
}

// Grab the 8 nicknames here
sendGetRequest("/getList")
.then(function(data){
  // vidRecent has the userid(prob not useful), url, nickname
  let allvids = JSON.parse(data);
  for (let i = 0; i < allvids.length; i++) {
    // Reminder to self, create class for ul, so
    // that we can toggle the dashed lines if there
    // is an element inside
    const currVid = "video"+i.toString();
    const vid = document.getElementById(currVid);
    vid.textContent = allvids[i]['nickname'];
    vid.className = "occupied";
    if (i == 7){
      play_game.disabled = false;
      add_new.disabled = true;
      play_game.className = "buttons";
      add_new.className = "disabled_button";
      console.log("Disable playgame since Db full");
    }
  }
})
.catch(function (error) {
     console.error('Error:', error);
});
// END GET LOGIC


// POST LOGIC -> this is for deleting videos
async function sendPostRequest(url, data) {
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function deleteVid(row){
  const vid = document.getElementById("video"+row);
  console.log("client side trying to delete", vid.textContent);
  sendPostRequest('/deleteVid', vid.textContent)
  .then(function (data) {
    // Alternatively we could have saved the nicknames from the
    // previous GET call into a Js object, and then 
    // we could have modified the variable without having to 
    // refresh the page
     window.location = "/myvideos.html";
  })
  .catch(function (error) {
     console.error('Error:', error);
  });
}

// I think this should work
for(let i = 0; i < 8; i++){
   buttonSetUp(i);
 }
 function buttonSetUp(c){
  x = document.getElementById("x" + c);
  x.addEventListener("click", event => {
    deleteVid(c);
  });
 }
// END POST LOGIC