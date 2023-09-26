// Get the audio element and create a variable to track the current song
var audioPlayer = document.getElementById("audioPlayer");
var currentSong = null;

// Get all the play buttons
var playButtons = document.querySelectorAll(".play-button");

// Attach event listeners to each play button
playButtons.forEach(function (button) {
    button.addEventListener("mouseover", function () {
        // When mouse hovers over the button, start playing the song
        var songName = this.getAttribute("data-song");
        playSong(songName);
    });

    button.addEventListener("click", function (event) {
        // Prevent the default click behavior to avoid following a link
        event.preventDefault();
        
        // When the button is clicked, play the song
        togglePlayback();
    });

    button.addEventListener("mouseout", function () {
        // When mouse moves away from the button, stop playing the song
        if (!audioPlayer.paused && !audioPlayer.ended) {
            audioPlayer.pause();
            currentSong = null;
        }
    });
});

// Function to play a song
function playSong(songName) {
    // Check if the same song is already playing; if not, change the source and play
    if (currentSong !== songName) {
        var sourceElement = audioPlayer.querySelector('source[src="' + songName.toLowerCase() + '.mp3"]');
        if (sourceElement) {
            audioPlayer.src = sourceElement.src;
            audioPlayer.play();
            currentSong = songName;
        }
    }
}

// Function to toggle playback (play/pause)
function togglePlayback() {
    if (audioPlayer.paused || audioPlayer.ended) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}
