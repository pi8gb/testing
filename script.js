import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const text = document.getElementById("text");


// -------------------------
// Start
// -------------------------

text.textContent = "Loading MediaPipe...";


// -------------------------
// Load MediaPipe
// -------------------------

const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

text.textContent = "Loading hand model...";


const handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },

        runningMode: "VIDEO",
        numHands: 1
    }
);


text.textContent = "Starting camera...";


// -------------------------
// Camera
// -------------------------

const stream = await navigator.mediaDevices.getUserMedia({
    video: true
});

video.srcObject = stream;


// Wait for the video to actually have frames
video.addEventListener("loadeddata", () => {

    text.textContent = "No hand detected";

    detect();

});


// -------------------------
// MediaPipe detection
// -------------------------

function detect() {

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );


    if (results.landmarks.length > 0) {

        const hand = results.landmarks[0];

        // Landmark 8 = index fingertip
        const indexTip = hand[8];

        text.textContent =
            "Index X: " + indexTip.x.toFixed(3) +
            " | Index Y: " + indexTip.y.toFixed(3);

    } else {

        text.textContent = "No hand detected";

    }


    requestAnimationFrame(detect);
}
