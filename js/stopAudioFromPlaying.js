function stopAudioFromPlaying() {
  const audio = document.getElementsByTagName("audio")[0];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
