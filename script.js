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


// Get the canvas and context for doodling
const doodleCanvas = document.getElementById('doodleCanvas');
const doodleContext = doodleCanvas.getContext('2d');

// Get the canvas and context for displaying an image
const imageCanvas = document.getElementById('imageCanvas');
const imageContext = imageCanvas.getContext('2d');

// Function to set the canvas width based on the maximum available height
function setCanvasWidth() {
    // Get the maximum available height based on the container
    const container = document.querySelector('.canvas-container');
    const containerHeight = container.clientHeight; // Maximum available height

    // Set the canvas width to a percentage of the maximum available height
    const canvasSizePercentage = 1; // Adjust this as needed (e.g., 80% of maximum height)
    const canvasWidth = containerHeight * canvasSizePercentage;

    // Set the canvas width and height
    doodleCanvas.width = canvasWidth;
    imageCanvas.width = canvasWidth;
    doodleCanvas.height = containerHeight;
    imageCanvas.height = containerHeight;
    drawImage();
}

// Call the setCanvasWidth function initially and when the container size changes
window.addEventListener('resize', setCanvasWidth);
setCanvasWidth(); // Call it initially to set canvas sizes

// Set up drawing properties for doodling
let drawing = false;

// Event listeners for mouse actions on the doodle canvas
doodleCanvas.addEventListener('mousedown', () => {
    drawing = true;
});

doodleCanvas.addEventListener('mouseup', () => {
    drawing = false;
    doodleContext.beginPath();
});

doodleCanvas.addEventListener('mousemove', draw);

// Function to draw on the doodle canvas
function draw(e) {
    if (!drawing) return;

    const rect = doodleCanvas.getBoundingClientRect();
    const scaleX = doodleCanvas.width / rect.width;
    const scaleY = doodleCanvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    doodleContext.lineWidth = 5;
    doodleContext.lineCap = 'round';
    doodleContext.strokeStyle = 'white';

    doodleContext.lineTo(x, y);
    doodleContext.stroke();
    doodleContext.beginPath();
    doodleContext.moveTo(x, y);
}

// Clear button event listener for the doodle canvas
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
    doodleContext.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
});

// Rest of your JavaScript code...
// Function to load and draw an image onto the canvas
function drawImage() {
    const img = new Image();
    img.src = 'https://merttens.github.io//assets/brainmri.jpg'; // Replace with the path to your image

    img.onload = () => {
        //imageCanvas.width = img.width;
        //imageCanvas.height = img.height;

        // Draw the original image on the canvas
        imageContext.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

        // Get the image data from the canvas
        const imageData = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        const data = imageData.data;
        // Loop through the pixel data and change the color (e.g., from red to blue)
        for (let i = 0; i < data.length; i += 4) {
            // Modify the R, G, and B values (e.g., change red to blue)
            data[i] = 0;       // Red channel
            data[i + 1] = 0;   // Green channel
            data[i + 2] = 0; // Blue channel
            // Alpha channel (data[i + 3]) remains unchanged
        }

        // Put the modified image data back on the canvas
        imageContext.putImageData(imageData, 0, 0);
    };
}

// Call the drawImage function to load and draw the image
drawImage();
