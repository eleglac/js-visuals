const button = document.getElementById("control");

function randomPCMFloat() {
  return Math.random() * 2.0 - 1.0;
}

let channels = 2; //# of audio channels
let transitions = [randomPCMFloat(), randomPCMFloat()]; //allow each new noise buffer to start with the final sample of the previous buffer
let sampleDuration = 5.0; //duration of each noise buffer in seconds

// c and v control "color" of the noise - v=1.0 is white, v=0.025 is brown-ish
let v = 0.025; //variation i.e. how much of next sample is random
let c = 1.0 - v; //color i.e. how much of the next sample is contributed by the last

//this function creates a buffer containing noise; current settings give brownish noise.
function createNoiseBuffer(audioCtx) {
  let frameCount = audioCtx.sampleRate * sampleDuration;
  let myArrayBuffer = audioCtx.createBuffer(
    channels,
    frameCount,
    audioCtx.sampleRate
  );

  //Fill the buffer with brown-ish noise
  for (let channel = 0; channel < channels; channel++) {
    let nowBuffering = myArrayBuffer.getChannelData(channel);
    let prev = transitions[channel];
    for (let ii = 0; ii < frameCount; ii++) {
      nowBuffering[ii] = prev * c + randomPCMFloat() * v;
      prev = nowBuffering[ii];
    }
    transitions[channel] = prev;
  }
  return myArrayBuffer;
}

//this function creates an audio node that ingests a noise buffer
//and has ramp-up applied if a rampTime is provided
//this is used to make sure the noise only "ramps" when it's first turned on
function soundNodeHandler(audioCtx, maxGain, rampTime) {
  let g = audioCtx.createGain();
  g.connect(audioCtx.destination);
  let source = audioCtx.createBufferSource();
  source.buffer = createNoiseBuffer(audioCtx);
  source.connect(g);
  if (rampTime) {
    //rampTime is only defined during initiation (see setTimeout callback below)
    g.gain.setValueAtTime(0, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(maxGain, audioCtx.currentTime + rampTime);
  } else {
    //we're already playing noise, no need to ramp, just set the gain for the new node and move on
    g.gain.setValueAtTime(maxGain, audioCtx.currentTime);
  }
  source.start();

  //kill old node, start a new one - ensures continuous playback
  //is it ideal? who knows! but it DOES work
  source.onended = () => {
    source.disconnect();
    g.disconnect();
    soundNodeHandler(audioCtx, maxGain);
  };
}

let AudioContext = window.AudioContext || window.webkitAudioContext;
let toggle = true; //haven't started yet? i.e. button NEVER clicked?
var audioCtx;
button.onclick = function () {
  if (toggle) {
    //if this is the first time the button was clicked
    audioCtx = new AudioContext(); //initiate the audio context
    let noiseTracks = 4; //multiple tracks of noise, to allow drowning of inter-segment clicks
    for (let ii = 0; ii < noiseTracks; ii++) {
      //stagger the initiation of the noise tracks, so they overlap each other
      var rampTime = sampleDuration / noiseTracks;
      setTimeout(() => {
        soundNodeHandler(audioCtx, 1.0 / noiseTracks, rampTime);
      }, ii * rampTime * 1000);
    }
    button.innerText = "Pause Noise";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    toggle = false; //we've already started, so we don't want to take the above path again
  } else {
    if (audioCtx.state === "suspended") {
      audioCtx.resume(); //resume playback
      button.innerText = "Pause noise";
      button.style.backgroundColor = "red";
      button.style.color = "white";
    } else if (audioCtx.state === "running") {
      audioCtx.suspend(); //pause playback
      button.innerText = "Continue noise";
      button.style.backgroundColor = "#02A24D";
      button.style.color = "black";
    }
  }
};
