async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href);
    }
  }

  return song;
}
async function main() {
  let song = await getSongs();
  console.log(song[0]);
  var audio = new Audio(song[0]);
  audio.play();
}

main();
