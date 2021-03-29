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
var recorder = null;
dictionary = [
  "hey",
  "hey sky",
  "zeig mir die aktuellen serienhighlights",
  "sky",
  "zeig",
  "wechsle",
  "mir",
  "die",
  "aktuellen",
  "serienhighlights",
];
var countFail = 0;
function onGetUserMedia(stream) {
  recorder = new MediaRecorder(stream);

  recorder.addEventListener("dataavailable", (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.data);
    console.log(e.data);
    reader.onloadend = function () {
      var ajax = new XMLHttpRequest();
      ajax.open(
        "POST",
        "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyB0prP56MBRzjZPVMLJHL408pTxzRtKJok",
        true
      );
      ajax.setRequestHeader("Content-type", "application/json");
      var params = {
        audio: {
          content: reader.result.split(",")[1],
        },
        config: {
          enableAutomaticPunctuation: false,
          encoding: "LINEAR16",
          languageCode: "de-DE",
          model: "default",
        },
      };
      ajax.send(JSON.stringify(params));
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
          var data = JSON.parse(ajax.responseText);
          var found = false;
          if (typeof data.results != "undefined") {
            var resString = data.results[0].alternatives[0].transcript.toLowerCase();
            var arResult = resString.split(" ");
            console.log(resString);
            $.each(arResult, function (i, v) {
              if (
                dictionary.indexOf(i) > -1 ||
                dictionary.indexOf(resString) > -1
              ) {
                videoContainer.style.animation = "fadeIn 1s ease";
                videoContainer.style.opacity = "1";
                videoContainer.style.display = "block";
                video.play();
                found = true;
                return false;
              }
            });
          }
          if (!found) {
            microText.innerHTML = `
            Versuche es <br />
            noch einmal.
            `;
            microText.style.animation = "fadeIn 1s ease";
            microText.style.opacity = "1";
          }
        }
      };
    };
  });
  recorder.start();
}

function onGetUserMediaError() {}

micro.addEventListener("click", () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    null;
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(onGetUserMedia, onGetUserMediaError);
  } else if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: true },
      onGetUserMedia,
      onGetUserMediaError
    );
  } else {
   
  }
  microText.style.animation = "fadeOut 1s ease";
  microText.style.opacity = "0";
  setTimeout(function () {
    if (recorder) {
      recorder.stop();
    }
  }, 4000);
});
