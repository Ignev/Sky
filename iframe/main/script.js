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

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
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
let grammar =
  "#JSGF V1.0; grammar words; public <word> = " + dictionary.join(" | ") + " ;";
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "de-DE";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function (event) {
  console.log("Confidence: " + event.results[0][0].confidence);

  var found = false;

  if (typeof event.results != "undefined") {
    var resString = event.results[0][0].transcript.toLowerCase();
    var arResult = resString.split(" ");
    console.log(resString);
    arResult.forEach(function (i) {
      if (dictionary.indexOf(i) > -1 || dictionary.indexOf(resString) > -1) {
        videoContainer.style.animation = "fadeIn 1s ease";
        videoContainer.style.opacity = "1";
        videoContainer.style.display = "block";
        video.play();
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

  resetMicrophoneIcons();
};
micro.addEventListener("click", () => {
  microText.style.animation = "fadeOut 1s ease";
  microText.style.opacity = "0";
  recognition.start();
  setTimeout(function () {
    recognition.stop();
  }, 4000);
});
