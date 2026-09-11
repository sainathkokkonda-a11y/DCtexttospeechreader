const synth = window.speechSynthesis;
let voices = [];

const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const rateVal = document.getElementById('rateVal');
const pitchVal = document.getElementById('pitchVal');
const pauseBtn = document.getElementById('pauseBtn');

function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    const option = document.createElement('option');
    option.textContent = "Default Browser Voice";
    option.value = "default";
    voiceSelect.appendChild(option);
    return;
  }

  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = voice.name + " (" + voice.lang + ")";
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
}

loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

function updateCounters() {
  const text = textInput.value;
  document.getElementById('charCount').innerText = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  document.getElementById('wordCount').innerText = words;
}

textInput.addEventListener('input', updateCounters);

rateInput.addEventListener('input', () => {
  rateVal.innerText = rateInput.value;
});

pitchInput.addEventListener('input', () => {
  pitchVal.innerText = pitchInput.value;
});

function speakText() {
  if (synth.speaking && synth.paused) {
    synth.resume();
    pauseBtn.innerText = "Pause";
    return;
  }

  if (synth.speaking) {
    synth.cancel();
  }

  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text to listen!");
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(text);
  const selectedOption = voiceSelect.selectedOptions[0];

  if (selectedOption && selectedOption.getAttribute('data-name')) {
    const selectedVoice = voices.find(v => v.name === selectedOption.getAttribute('data-name'));
    if (selectedVoice) utterThis.voice = selectedVoice;
  }

  utterThis.rate = parseFloat(rateInput.value);
  utterThis.pitch = parseFloat(pitchInput.value);

  utterThis.onend = function () {
    pauseBtn.innerText = "Pause";
  };

  synth.speak(utterThis);
  pauseBtn.innerText = "Pause";
}

function pauseResumeText() {
  if (synth.speaking) {
    if (synth.paused) {
      synth.resume();
      pauseBtn.innerText = "Pause";
    } else {
      synth.pause();
      pauseBtn.innerText = "Resume";
    }
  }
}

function stopText() {
  if (synth.speaking) {
    synth.cancel();
    pauseBtn.innerText = "Pause";
  }
}

function clearText() {
  stopText();
  textInput.value = '';
  updateCounters();
}

function copyText() {
  const text = textInput.value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    alert("Text copied to clipboard!");
  });
}

// Event Listeners for Buttons
document.getElementById('listenBtn').addEventListener('click', speakText);
pauseBtn.addEventListener('click', pauseResumeText);
document.getElementById('stopBtn').addEventListener('click', stopText);
document.getElementById('copyBtn').addEventListener('click', copyText);
document.getElementById('clearBtn').addEventListener('click', clearText);
