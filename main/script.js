micro.addEventListener("click", ()=>{
    videoContainer.style.animation = "fadeIn 1s ease";
    videoContainer.opacity = "1";
    videoContainer.style.display = "block"
    video.play();
})
sound.addEventListener("click", () => {
  if (video.muted == true) {
    video.muted = false;
    mute.style.display = "block";
    sound.style.display = "none";
  } else {
    video.muted = true;
    sound.style.display = "block";
    mute.style.display = "none";
  }
});
mute.addEventListener("click", () => {
  if (video.muted == true) {
    video.muted = false;
    mute.style.display = "block";
    sound.style.display = "none";
  } else {
    video.muted = true;
    sound.style.display = "block";
    mute.style.display = "none";
  }
});
video.onended = function (e) {
    restart.style.display = "block";
    sound.style.display = "none";
    stop = true;
};
restart.addEventListener("click", () => {
  video.play();
  sound.style.display = "block";
  restart.style.display = "none";
});
