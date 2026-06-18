// Music player for music.html
// Hover-to-preview: hovering a button plays the song; mouse-out pauses.
// Click toggles play/pause so you can keep a song playing.

(function () {
  var player     = document.getElementById('audioPlayer');
  var currentSrc = null;

  function playSong(src) {
    if (currentSrc !== src) {
      player.src = src + '.mp3';
      player.load();
      currentSrc = src;
    }
    player.play().catch(function () {});
  }

  function pauseSong() {
    if (!player.paused) player.pause();
  }

  document.querySelectorAll('.play-button').forEach(function (btn) {
    var song = btn.getAttribute('data-song');

    btn.addEventListener('mouseover', function () {
      playSong(song);
    });

    btn.addEventListener('mouseout', function () {
      pauseSong();
      currentSrc = null;
    });

    btn.addEventListener('click', function () {
      if (player.paused || player.ended) {
        playSong(song);
      } else {
        pauseSong();
      }
    });
  });
})();
