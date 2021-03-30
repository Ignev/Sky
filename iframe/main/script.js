var user = detect.parse(navigator.userAgent);
if (user.browser.family === "Chrome" || user.browser.family === "Chrome Mobile") {
  console.log("You're using the Chrome browser");
  console.log(user.browser.family);
}
else{
  console.log("You're using no the Chrome browser");
  console.log(user.browser.family);
}
sound.addEventListener("click", function () {
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
mute.addEventListener("click", function () {
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
restart.addEventListener("click", function () {
  video.play();
  sound.style.display = "block";
  restart.style.display = "none";
});

if (user.browser.family === "Chrome" || user.browser.family === "Chrome Mobile") {
  dictionary = [
    "hey",
    "sky",
    "hey sky",
    "zeig mir",
    "mir die",
    "zeig mir die",
    "wechsle",
    "mir",
    "die",
    "aktuellen",
    "die aktuellen",
    "serienhighlights",
    "zeig mir die aktuellen serienhighlights",
    "hey sky zeig mir die aktuellen serienhighlights",
  ];
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
  let grammar =
    "#JSGF V1.0; grammar words; public <word> = " +
    dictionary.join(" | ") +
    " ;";
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
      arResult.forEach(function (i, v) {
        if (dictionary.indexOf(i) > -1 || dictionary.indexOf(resString) > -1) {
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
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onerror = function (event) {
    console.error("error" + event);
  };
} else {
  var recorder = null;
  var words = {
    ".module": [
      'hey sky zeig mir die aktuellen serienhighlights',
			'hey sky zeig mir die aktuellen serien',
			'hey sky zeig mir die aktuellen',
			'hey sky zeig mir die',
			'hey sky zeig mir',
			'hey sky zeig',
			'hey sky',
			'hey',
			'sky',
			'zeig',
			'mir',
			'die',
			'aktuellen',
			'serienhighlights',
			'serien highlights',
			'serien high lights',
			'serien',
			'highlights',
			'zeig mir die',
			'zeig mir',
			'aktuellen serienhighlights',
			'aktuellen serien',
    ],
  };

  var countFail = 0;
  function onGetUserMedia(stream) {
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("dataavailable", (e) => {
      var reader = new FileReader();
      reader.readAsDataURL(e.data);
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
                $.each(words, function (j, w) {
                  if (
                    words[j].indexOf(v) > -1 ||
                    words[j].indexOf(resString) > -1
                  ) {
                    videoContainer.style.animation = "fadeIn 1s ease";
                    videoContainer.style.opacity = "1";
                    videoContainer.style.display = "block";
                    video.play();
                    found = true;
                    return false;
                  }
                });
              });
            }
            if (!found) {
              countFail++;
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
}

micro.addEventListener("click", function () {
    if (user.browser.family === "Chrome" || user.browser.family === "Chrome Mobile") {
      try {
        recognition.start();
      micro.classList.add("micro-action");
      microText.style.animation = "fadeOut 1s ease";
      microText.style.opacity = "0";
      setTimeout(function () {
        micro.classList.remove("micro-action");
        recognition.stop();
      }, 4000);
      } catch (error) {
        alert("Mikrofonzugang einschalten");
      }
      
    } else {
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
      try {
        micro.classList.add("micro-action");
      microText.style.animation = "fadeOut 1s ease";
      microText.style.opacity = "0";
      setTimeout(function () {
        if (recorder) {
          micro.classList.remove("micro-action");
          recorder.stop();
        }
      }, 4000);
      } catch (error) {
        alert("Mikrofonzugang einschalten")
      }
      
    }
  

});
