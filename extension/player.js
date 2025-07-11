import { sendEvent } from './analytics.js';

const videoUrl = window.location.search.replace('?url=', '');
const videoPlayer = document.getElementById('videoPlayer');
const downloadButton = document.querySelector('.download-button');
const downloadMessage = document.querySelector('.download-message');

if (videoUrl) videoPlayer.src = videoUrl;

if (!sessionStorage.getItem('tracked')) {
  sessionStorage.setItem('tracked', '1');
  sendEvent('player_loaded');
}

downloadButton.addEventListener('click', () => {
  videoPlayer.pause();
  downloadMessage.classList.add('show');
  window.open(videoUrl, '_blank');
  setTimeout(window.close, 3000);
});
