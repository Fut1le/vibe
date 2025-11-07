const audio = document.getElementById('lofi-radio');
const playButton = document.getElementById('play-button');
const playIcon = document.getElementById('play-icon');
let isPlaying = false;
let spacePressHandled = false;  // Флаг для отслеживания состояния пробела
let currentSource = 'radio';

const radioSources = [
  { url: "https://lofi.stream.laut.fm/lofi?ref=radiode&t302=2022-04-06_17-32-36&uuid=47bbcee5-a0bc-47c2-8475-72e9f74b865c", name: "RELAX 1" },
  { url: "https://listen.reyfm.de/lofi_320kbps.mp3", name: "RELAX 2" },
  { url: "https://boxradio-edge-01.streamafrica.net/lofi", name: "RELAX 3" },
  { url: "https://api.chilloutradio.ru:8040/live", name: "RELAX 4" },
  { url: "https://boxradio-edge-01.streamafrica.net/chillwave", name: "CHILL 5" },
  { url: "http://ec3.yesstreaming.net:3750/stream", name: "CHILL 6" },
  { url: "https://live.amperwave.net/direct/ppm-jazz24mp3-ibc1", name: "JAZZ 7" },
  { url: "https://boxradio-edge-01.streamafrica.net/jazz", name: "JAZZ 8" },
  { url: "https://play.streamafrica.net/oldtimeradio", name: "RETRO 9" },
  { url: "https://boxradio-edge-01.streamafrica.net/classical", name: "CLASSIC 10" },
  { url: "https://radio.hearme.fm/listen/hearme.fm_-_blues_rock/stream", name: "BLUES 11" },
  { url: "https://boxradio-edge-01.streamafrica.net/rock", name: "ROCK 12" },
  { url: "https://boxradio-edge-09.streamafrica.net/spirit", name: "R&B 13" },
  { url: "https://boxradio-edge-01.streamafrica.net/pop", name: "POP 14" },
  { url: "https://boxradio-edge-01.streamafrica.net/jpop", name: "JPOP 15" },
  { url: "https://boxradio-edge-01.streamafrica.net/anime", name: "ANIME 16" }
];

let currentRadioIndex = 0;

function updateRadioSource() {
  if (currentSource !== 'radio') return;
  
  audio.src = radioSources[currentRadioIndex].url;
  document.getElementById('radio-display').textContent = radioSources[currentRadioIndex].name;
  
  if (isPlaying) {
    audio.play();
  }
  updateMediaSession();
}

const artworkArray = [
  { src: 'art/alb/alb-1.png', sizes: '512x512', type: 'image/png' },
  { src: 'art/alb/alb-2.png', sizes: '512x512', type: 'image/png' },
  { src: 'art/alb/alb-3.png', sizes: '512x512', type: 'image/png' },
  { src: 'art/alb/alb-4.png', sizes: '512x512', type: 'image/png' }
];

function updateMediaSession() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: radioSources[currentRadioIndex].name,
      artist: 'Vibe Radio',
      album: 'Online',
      artwork: [artworkArray[currentRadioIndex % artworkArray.length]]
    });
    
    // Установите обработчики действий медиа
    navigator.mediaSession.setActionHandler('play', function() { togglePlayPause(); });
    navigator.mediaSession.setActionHandler('pause', function() { togglePlayPause(); });
    
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      currentRadioIndex = (currentRadioIndex > 0) ? currentRadioIndex - 1 : radioSources.length - 1;
      updateRadioSource();
    });
    
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      currentRadioIndex = (currentRadioIndex < radioSources.length - 1) ? currentRadioIndex + 1 : 0;
      updateRadioSource();
    });
  }
}


function updatePlayIcon() {
  playIcon.classList.toggle('fa-play', !isPlaying);
  playIcon.classList.toggle('fa-pause', isPlaying);
}

function togglePlayPause() {
  if (currentSource === 'radio') {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  } else if (currentSource === 'youtube') {
    if (isPlaying) {
      youtubePlayer.pauseVideo();
    } else {
      youtubePlayer.playVideo();
    }
  }
}

playButton.addEventListener('click', function(event) {
  event.preventDefault();
  togglePlayPause();
});

audio.addEventListener('play', function() {
  isPlaying = true;
  updatePlayIcon();
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'playing';
  }
});

audio.addEventListener('pause', function() {
  isPlaying = false;
  updatePlayIcon();
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused';
  }
});

// Плей-пауза (клавиатура)
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !spacePressHandled) {
    event.preventDefault();
    spacePressHandled = true;
    togglePlayPause();
  }
});

document.addEventListener('keyup', function(event) {
  if (event.code === 'Space') {
    spacePressHandled = false;  // Сброс флага нажатия на пробел при отпускании
  }
});

// Setting event listeners
document.getElementById('prev-radio').addEventListener('click', function() {
  currentRadioIndex = (currentRadioIndex > 0) ? currentRadioIndex - 1 : radioSources.length - 1;
  updateRadioSource();
  stopYouTube();
});

document.getElementById('next-radio').addEventListener('click', function() {
  currentRadioIndex = (currentRadioIndex < radioSources.length - 1) ? currentRadioIndex + 1 : 0;
  updateRadioSource();
  stopYouTube();
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    currentRadioIndex = (currentRadioIndex > 0) ? currentRadioIndex - 1 : radioSources.length - 1;
    updateRadioSource();
  } else if (event.key === 'ArrowRight') {
    currentRadioIndex = (currentRadioIndex < radioSources.length - 1) ? currentRadioIndex + 1 : 0;
    updateRadioSource();
  }
});

// Обновляем Media Session при загруженной странице
updateRadioSource();

const volumeButton = document.getElementById('volume-button');
const volumeIcon = document.getElementById('volume-icon');
const volumePanel = document.getElementById('volume-panel');
const volumeSlider = document.getElementById('volume-slider');

volumeButton.addEventListener('click', function (event) {
  event.preventDefault();
  volumePanel.classList.toggle('show');
  mixerPanel.classList.remove('show');
  timerPanel.classList.remove('show');
  settingsPanel.classList.remove('show');
});

// Update the audio volume based on the slider value
volumeSlider.addEventListener('input', function() {
  const volume = volumeSlider.value / 100;
  audio.volume = volume;
  youtubePlayer.setVolume(volume * 100); // Update YouTube player volume
  updateVolumeIcon();
});

// Update volume slider and icon based on the current volume
function updateVolumeIcon() {
  const volume = volumeSlider.value / 100;
  volumeIcon.classList.toggle('fa-volume-mute', volume === 0);
  volumeIcon.classList.toggle('fa-volume-down', volume > 0 && volume <= 0.5);
  volumeIcon.classList.toggle('fa-volume-up', volume > 0.5);
}

// Volume change function for keyboard
function changeVolume(delta) {
  let newVolume = Math.min(Math.max(volumeSlider.valueAsNumber + delta, 0), 100);
  volumeSlider.value = newVolume;
  const volume = newVolume / 100;
  audio.volume = volume;
  youtubePlayer.setVolume(volume * 100); // Update YouTube player volume
  updateVolumeIcon();
}

// Keyboard volume control
window.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    changeVolume(5); // Increase volume by 5
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    changeVolume(-5); // Decrease volume by 5
  }
});

// Initial volume setup on page load
document.addEventListener('DOMContentLoaded', function () {
  const volume = volumeSlider.value / 100;
  audio.volume = volume;
  if (youtubePlayer && youtubePlayer.setVolume) {
    youtubePlayer.setVolume(volume * 100); // Initialize YouTube player volume
  }
  updateVolumeIcon();
});


// YouTube Player
let youtubePlayer;
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Set initial volume for YouTube player
  const volume = volumeSlider.value / 100;
  youtubePlayer.setVolume(volume * 100);
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayIcon();
  } else {
    isPlaying = false;
    updatePlayIcon();
  }
}

function loadYouTubeVideo(videoId) {
  if (currentSource === 'radio') {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
  }
  currentSource = 'youtube';
  youtubePlayer.loadVideoById(videoId);
}

function loadYouTubePlaylist(playlistId) {
  if (currentSource === 'radio') {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
  }
  currentSource = 'youtube';
  youtubePlayer.loadPlaylist({
    list: playlistId,
    listType: 'playlist'
  });
}

function stopYouTube() {
  if (youtubePlayer) {
    youtubePlayer.stopVideo();
    currentSource = 'radio';
    isPlaying = false;
    updatePlayIcon();
  }
}

const mixerButton = document.getElementById('mixer-button');
const mixerPanel = document.getElementById('mixer-panel');

mixerButton.addEventListener('click', function (event) {
  event.preventDefault();
  mixerPanel.classList.toggle('show');
  volumePanel.classList.remove('show');
  timerPanel.classList.remove('show');
  settingsPanel.classList.remove('show');
});

// Ambient Mixer
const soundButtons = document.querySelectorAll('.sound-button');
soundButtons.forEach(button => {
  const sound = button.querySelector('audio');
  const slider = button.querySelector('.slider');
  
  button.addEventListener('click', function (event) {
    if (event.target !== slider) {  // игнорируем нажатие на слайдер
      event.preventDefault();
      if (slider.value == 0) {
        slider.value = 30;
        sound.volume = 0.3;
      }
      if (sound.paused) {
        sound.play();
        button.classList.add('active');
      } else {
        sound.pause();
        button.classList.remove('active');
      }
    }
  });
  
  slider.addEventListener('input', function (event) {
    sound.volume = slider.value / 100;
    if (slider.value == 0) {
      sound.pause();
      button.classList.remove('active');
    } else {
      if (sound.paused) sound.play();
      button.classList.add('active');
    }
  });
  
  sound.addEventListener('play', function() {
    button.classList.add('active');
  });
  
  sound.addEventListener('pause', function() {
    button.classList.remove('active');
  });
});

const muteAllButton = document.getElementById('mute-all-button');

muteAllButton.addEventListener('click', function() {
  soundButtons.forEach(button => {
    const sound = button.querySelector('audio');
    const slider = button.querySelector('.slider');
    
    if (!sound.paused) {
      sound.pause();
      button.classList.remove('active');
      slider.value = 0;
    }
  });
});

const timerButton = document.getElementById('timer-button');
const timerPanel = document.getElementById('timer-panel');
const timerToggle = document.getElementById('timer-toggle');
const timerDisplay = document.getElementById('timer-display');

let timer = null;
let timeRemaining = 0;

timerButton.addEventListener('click', function (event) {
  event.preventDefault();
  timerPanel.classList.toggle('show');
  volumePanel.classList.remove('show');
  mixerPanel.classList.remove('show');
  settingsPanel.classList.remove('show');
});

let isTimerEnabled = false;

const timerToggleButton = document.getElementById('timer-toggle-button');
timerToggleButton.addEventListener('click', function () {
  isTimerEnabled = !isTimerEnabled;
  timerToggleButton.textContent = isTimerEnabled ? 'OFF' : 'ON';
  if (isTimerEnabled) {
    clearInterval(timer);
    timer = setInterval(function () {
      if (timeRemaining <= 0) {
        clearInterval(timer);
        isTimerEnabled = false;
        timerToggleButton.textContent = 'ON';
        document.querySelectorAll('audio').forEach(audio => audio.pause());
        if (currentSource === 'radio') {
          audio.pause();
        } else if (currentSource === 'youtube') {
          youtubePlayer.pauseVideo();
        }
        highlightPreset(null);
        
      } else {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
    }, 1000);
  } else {
    clearInterval(timer);
    timerDisplay.textContent = '0:00';
    timeRemaining = 0;
  }
});

window.addTime = function (minutes) {
  timeRemaining += minutes * 60;
  const min = Math.floor(timeRemaining / 60);
  const sec = timeRemaining % 60;
  timerDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

window.subtractTime = function (minutes) {
  timeRemaining -= minutes * 60;
  if (timeRemaining < 0) timeRemaining = 0;
  const min = Math.floor(timeRemaining / 60);
  const sec = timeRemaining % 60;
  timerDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Пресеты Ambient Mixer
const addPresetButton = document.getElementById('add-preset-button');
const presetScrollView = document.getElementById('preset-scroll-view');
let presets = JSON.parse(localStorage.getItem('presets')) || [];
let activePresetIndex = null;

addPresetButton.addEventListener('click', function() {
  const selectedSounds = Array.from(soundButtons)
  .filter(button => !button.querySelector('audio').paused)
  .map(button => {
    const soundId = button.getAttribute('data-sound-id');
    const volume = button.querySelector('.slider').value;
    return { soundId, volume };
  });
  
  if (selectedSounds.length === 0) {
    alert("Пожалуйста, выберите хотя бы один звук перед созданием пресета.");
    return;
  }
  
  const presetName = prompt("Введите название для пресета:");
  if (presetName) {
    const newPreset = {
      name: presetName,
      sounds: selectedSounds,
    };
    presets.push(newPreset);
    savePresets();
    updatePresetList();
  }
});

muteAllButton.addEventListener('click', function() {
  stopAllSounds();
  activePresetIndex = null;
  document.querySelectorAll('.preset-container').forEach(container => container.classList.remove('active'));
});

function updatePresetList() {
  document.querySelectorAll('.preset-container').forEach(container => container.remove());
  
  presets.forEach((preset, index) => {
    const presetButton = document.createElement('button');
    presetButton.className = 'preset-button';
    presetButton.innerHTML = `<i class="fas fa-music"></i> <span>${preset.name}</span>`;
    presetButton.addEventListener('click', () => {
      applyPreset(index);
      highlightPreset(index);
    });
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-preset';
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      editPreset(index);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-preset';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm("Вы уверены, что хотите удалить этот пресет?")) {
        deletePreset(index);
      }
    });
    
    const presetContainer = document.createElement('div');
    presetContainer.className = 'preset-container';
    presetContainer.append(presetButton, editButton, deleteButton);
    
    presetScrollView.insertBefore(presetContainer, addPresetButton);
    
    if (index === activePresetIndex) {
      presetContainer.classList.add('active');
    }
  });
}

function stopAllSounds() {
  const allAudioElements = document.querySelectorAll('.sound-button audio');
  allAudioElements.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function applyPreset(index) {
  stopAllSounds();
  
  const preset = presets[index];
  preset.sounds.forEach(sound => {
    const button = document.querySelector(`.sound-button[data-sound-id="${sound.soundId}"]`);
    if (button) {
      const slider = button.querySelector('.slider');
      slider.value = sound.volume;
      
      const audio = button.querySelector('audio');
      audio.volume = sound.volume / 100;
      if (sound.volume > 0) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  });
  
  highlightPreset(index);
}

function highlightPreset(index) {
  activePresetIndex = index;
  document.querySelectorAll('.preset-container').forEach((container, i) => {
    container.classList.toggle('active', i === index);
  });
}

function editPreset(index) {
  const newName = prompt("Введите новое название для пресета:", presets[index].name);
  if (newName) {
    presets[index].name = newName;
    savePresets();
    updatePresetList();
  }
}

function deletePreset(index) {
  presets.splice(index, 1);
  savePresets();
  updatePresetList();
}

function savePresets() {
  localStorage.setItem('presets', JSON.stringify(presets));
}

updatePresetList();

// Загрузка пресетов из локального хранилища
function loadPresets() {
  const presetsJSON = localStorage.getItem('presets');
  if (presetsJSON) {
    presets = JSON.parse(presetsJSON);
  }
}

// Сохранение пресетов в локальное хранилище
function savePresets() {
  const presetsJSON = JSON.stringify(presets);
  localStorage.setItem('presets', presetsJSON);
}

// Функция для экспорта пресетов в JSON файл
function exportPresets() {
  const presetsJSON = JSON.stringify(presets, null, 2);
  const blob = new Blob([presetsJSON], { type: 'application/json' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = 'presets.json';
  link.click();
}

// Функция для импорта пресетов из JSON файла
function importPresets() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedPresets = JSON.parse(e.target.result);
        presets = presets.concat(importedPresets); // Добавляем импортированные пресеты
        savePresets();
        updatePresetList();
      } catch (error) {
        alert("Ошибка при импорте: неверный формат файла.");
      }
    };
    
    reader.readAsText(file);
  });
  
  input.click(); // Открываем диалог выбора файла
}

// Кнопка для экспорта пресетов
const exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', exportPresets);

// Кнопка для импорта пресетов
const importButton = document.getElementById('import-button');
importButton.addEventListener('click', importPresets);

// YouTube input handling
const youtubeInput = document.getElementById('youtube-input');
document.getElementById('youtube-submit').addEventListener('click', function() {
  const url = youtubeInput.value;
  const playlistMatch = url.match(/list=([^&]+)/);
  const videoMatch = url.match(/v=([^&]+)/);
  
  if (playlistMatch) {
    loadYouTubePlaylist(playlistMatch[1]);
  } else if (videoMatch) {
    loadYouTubeVideo(videoMatch[1]);
  } else {
    alert('Invalid YouTube URL');
  }
  youtubeInput.value = ''; // Clear input
});


// Обработчик события на загрузку DOM
document.addEventListener("DOMContentLoaded", function() {
  // Проверяем локальное хранилище на наличие настроек
  const isSearchVisible = localStorage.getItem('searchVisible') === 'true';
  const searchContainer = document.getElementById('youtube-controls');
  const toggleSearchButton = document.getElementById('toggle-search');
  
  // Если включено, показываем поле ввода и кнопку
  if (isSearchVisible) {
    searchContainer.style.display = 'block';
    toggleSearchButton.textContent = 'YouTube: Visible';
  }
  
  // Обработчик нажатия на кнопку переключения поиска
  toggleSearchButton.addEventListener('click', function() {
    const isVisible = searchContainer.style.display === 'block';
    
    if (isVisible) {
      searchContainer.style.display = 'none';
      toggleSearchButton.textContent = 'YouTube: Hidden';
      localStorage.setItem('searchVisible', 'false');
    } else {
      
      searchContainer.style.display = 'block';
      toggleSearchButton.textContent = 'YouTube: Visible';
      localStorage.setItem('searchVisible', 'true');
    }
  });
});

// Список ссылок на YouTube
const links = [
  'https://www.youtube.com/watch?v=KoXg55nT4zY',
  'https://www.youtube.com/watch?v=7HO9muWs0o0',
  'https://www.youtube.com/watch?v=zdBGqWnpDRk',
  'https://www.youtube.com/watch?v=G4mN11vv9BU',
  'https://www.youtube.com/watch?v=NMFA5036WIQ',
  'https://www.youtube.com/watch?v=LdS7YC4zzOk',
  'https://www.youtube.com/watch?v=PoyDhIe63-c',
  'https://www.youtube.com/watch?v=bT1Z6ZO_0qc',
  'https://www.youtube.com/watch?v=VnjdikpgR0E',
  'https://www.youtube.com/watch?v=CMNyHBx1gak',
  'https://www.youtube.com/watch?v=O7RG-B6N1Vw',
  'https://www.youtube.com/watch?v=n61ULEU7CO0',
  'https://www.youtube.com/watch?v=zFhfksjf_mY',
  'https://www.youtube.com/watch?v=_gVrQa_bvm8',
  'https://www.youtube.com/watch?v=l_7e2ZamUpI',
  'https://www.youtube.com/watch?v=lw8q4sR2xGE',
  'https://www.youtube.com/watch?v=mM1dIwGO00w',
  'https://www.youtube.com/watch?v=bqpd_J-z9j8',
  'https://www.youtube.com/watch?v=mjB0d2Jbanw',
  'https://www.youtube.com/watch?v=Qpa1DPY4o3E',
  'https://www.youtube.com/watch?v=dGj5JhKu3js',
  'https://www.youtube.com/watch?v=3e2EWj52sNM',
  'https://www.youtube.com/watch?v=WgmCloGBBwY',
  'https://www.youtube.com/watch?v=vBtlMwiOas4',
  'https://www.youtube.com/watch?v=EH1I-8KyI9Y',
  'https://www.youtube.com/watch?v=Axh6nK1fO1c',
  'https://www.youtube.com/watch?v=RljE0XwuQpI',   
  'https://www.youtube.com/watch?v=iWh41a3WnuM',
  'https://www.youtube.com/watch?v=ONkRM1pD2-M',
  'https://www.youtube.com/watch?v=pASkRqMTlBw',  
  'https://www.youtube.com/watch?v=ru7oJ8F0thQ',
  'https://www.youtube.com/watch?v=gLD-WKMVYhE',
  'https://www.youtube.com/watch?v=oyjGlPKmTYI',
  'https://www.youtube.com/watch?v=wPRwhu7WKp4',
  'https://www.youtube.com/watch?v=0xccB-_nvqk',
  'https://www.youtube.com/watch?v=FDFqzVy2nI0',
  'https://www.youtube.com/watch?v=1fgKHmPKiQo',
  'https://www.youtube.com/watch?v=fPb7doh686c'
];

// Функция для получения случайной ссылки
function getRandomLink() {
  const randomIndex = Math.floor(Math.random() * links.length);
  return links[randomIndex];
}

// Обработчик события для кнопки обновления
document.getElementById('refresh-button').addEventListener('click', () => {
  youtubeInput.value = getRandomLink();
});

// Non-stop mode =3
let shuffleEnabled = localStorage.getItem('shuffleEnabled') === 'true' ? true : false;

document.addEventListener("DOMContentLoaded", function() {
  const shuffleButton = document.getElementById('youtube-shuffle');
  shuffleButton.textContent = 'Non-stop Shuffle: ' + (shuffleEnabled ? 'ON' : 'OFF');
  
  shuffleButton.addEventListener('click', function () {
    shuffleEnabled = !shuffleEnabled;
    this.textContent = 'Non-stop Shuffle: ' + (shuffleEnabled ? 'ON' : 'OFF');
    localStorage.setItem('shuffleEnabled', shuffleEnabled);
  });
});

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED && shuffleEnabled) {
    const randomLink = getRandomLink();
    const videoMatch = randomLink.match(/v=([^&]+)/);
    if (videoMatch) {
      loadYouTubeVideo(videoMatch[1]);
    }
  } else if (event.data == YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayIcon();
  } else {
    isPlaying = false;
    updatePlayIcon();
  }
}


const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');

settingsButton.addEventListener('click', function (event) {
  event.preventDefault();
  settingsPanel.classList.toggle('show');
  volumePanel.classList.remove('show');
  mixerPanel.classList.remove('show');
  timerPanel.classList.remove('show');
});