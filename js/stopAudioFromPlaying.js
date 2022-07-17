function stopAudioFromPlaying() {
  const audio = document.getElementsByTagName("audio")[0];
  audio.pause();
  audio.currentTime = 0;
}
