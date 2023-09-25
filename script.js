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
    const csvUrl = 'assets/brainmri.csv'; // Replace with the URL of your CSV file

    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvContent) => {
        // Parse the CSV data into a 2D array
        const rows = csvContent.split('\n');
        const data = [];
    
        for (const row of rows) {
          const columns = row.split(',');
          data.push(columns);
        }
    
        // Define canvas dimensions based on data size
        const numRows = data.length;
        const numCols = data[0].length;
    
        // Create a new ImageData object
        const imageData = new ImageData(numCols, numRows);
        const pixelData = imageData.data;
    
        // Map CSV data to pixel data (simplified example: grayscale values)
        for (let y = 0; y < numRows; y++) {
          for (let x = 0; x < numCols; x++) {
            const value = parseFloat(data[y][x]);
            const pixelIndex = (y * numCols + x) * 4;
    
            // In this example, map a value to a grayscale color
            const grayValue = Math.round((value / 255) * 255);
            pixelData[pixelIndex] = grayValue; // Red channel
            pixelData[pixelIndex + 1] = grayValue; // Green channel
            pixelData[pixelIndex + 2] = grayValue; // Blue channel
            pixelData[pixelIndex + 3] = 255; // Alpha channel (fully opaque)
          }
        }
    
        // Put the pixel data on the canvas
        imageContext.putImageData(imageData, 0, 0);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });

}

// Call the drawImage function to load and draw the image
drawImage();
