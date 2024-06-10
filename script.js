let previous = document.getElementById("previous");
let play = document.getElementById("play");
let next = document.getElementById("next");
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  console.log(songs);
  return songs;
}
const playMusic = (track) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "./songs/" + track;
  currentSong.play();
  play.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
  document.querySelector(".songInfo").innerHTML = track.replaceAll("%20", " ");
};

async function main() {
  songs = await getSongs();
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><img class="invert" src="assets/song.svg" alt="" />
                <div class="info">
                  <div class="songName">${song.replaceAll("%20", " ")}</div>
                  <div class="songArtist">song artist</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <i class="fa-solid fa-play"></i>
                </div></li>`;
  }
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
      play.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
    });
  });

  //attach an event listener to previous play next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`;
    } else {
      currentSong.pause();
      play.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
    }
  });

  // time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} : ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + `%`;
  });
  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}
main();
