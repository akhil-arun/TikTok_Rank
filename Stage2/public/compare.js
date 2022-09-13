let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  //heartButtons[i].classList.remove("loved");
} // for loop

let first_heart = document.getElementById("first");
let second_heart = document.getElementById("second");
let next = document.getElementById("next");

first_heart.children[0].classList.remove("unloved");
first_heart.children[1].classList.remove("loved");
second_heart.children[0].classList.remove("unloved");
second_heart.children[1].classList.remove("loved");

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
let vidOneId, vidTwoId;
sendGetRequest("/getTwoVideos")
.then(function(data){
   const urls = [data[0].url, data[1].url];
   vidOneId = data[0].rowIdNum;
   vidTwoId = data[1].rowIdNum;
   document.getElementById("firstname").textContent = data[0].nickname;
  document.getElementById("secondname").textContent = data[1].nickname;

   for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
})
.catch(function(error){
  console.log("Error: ", error);
});





first_heart.addEventListener("click", event => {
//TODO
  first_heart.children[0].classList.add("unloved");
  first_heart.children[0].classList.remove("loved");
  first_heart.children[1].classList.add("loved");
  first_heart.children[1].classList.remove("unloved");
  second_heart.children[0].classList.add("loved");
  second_heart.children[0].classList.remove("unloved");
  second_heart.children[1].classList.remove("loved");
  second_heart.children[1].classList.add("unloved");


});

second_heart.addEventListener("click", event => {
//TODO
  second_heart.children[0].classList.add("unloved");
  second_heart.children[0].classList.remove("loved");
  second_heart.children[1].classList.add("loved");
  second_heart.children[1].classList.remove("unloved");
  first_heart.children[0].classList.add("loved");
  first_heart.children[0].classList.remove("unloved");
  first_heart.children[1].classList.remove("loved");
  first_heart.children[1].classList.add("unloved");
  
});

next.addEventListener("click", event => {
  let winner = 0;
  let loser = 0;
  if(!first_heart.children[1].classList.contains("loved") && !second_heart.children[1].classList.contains("loved")){
    alert("You have to select which video you like more by clicking on the heart!");
    return;
  }
  if(first_heart.children[1].classList.contains("loved")){
    winner = vidOneId;
    loser = vidTwoId;
  }
  else{
    winner = vidTwoId;
    loser = vidOneId;
  }
  let pref = {
    "better" : winner,
    "worse" : loser
  };
  
  
  sendPostRequest("/insertPref", pref)
  .then(function(data){
      if(data == "Pick Winner"){
        window.location = "/winner.html";
      }
      else{
        window.location = "/compare.html";
      }
  })
  .catch(function (error){
    console.log("Error: ", error);
  });
    
});
  




    