const videoUrl = window.location.search.replace('?url=', '');
const videoPlayer = document.getElementById('videoPlayer');
const loadingSpinner = document.querySelector('.loading-spinner');
const downloadButton = document.querySelector('.download-button');
const downloadMessage = document.querySelector('.download-message');

if (videoUrl) {
    videoPlayer.src = videoUrl;
}

videoPlayer.addEventListener('loadstart', () => {
    loadingSpinner.style.display = 'block';
});

videoPlayer.addEventListener('canplay', () => {
    loadingSpinner.style.display = 'none';
});

downloadButton.addEventListener('click', () => {
    videoPlayer.pause();
    downloadMessage.classList.add('show');
    window.open(videoUrl, '_blank');
    setTimeout(window.close, 3000);
});
