import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";


// -------------------------
// 1. Load MediaPipe
// -------------------------

const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },

        runningMode: "VIDEO",

        numHands: 2
    }
);


// -------------------------
// 2. Get HTML elements
// -------------------------

const video = document.getElementById("video");
const text = document.getElementById("text");


// -------------------------
// 3. Start camera
// -------------------------

const stream = await navigator.mediaDevices.getUserMedia({
    video: true
});

video.srcObject = stream;


// -------------------------
// 4. Detect hands
// -------------------------

function detect() {

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );

    console.log(results);


    // Check if MediaPipe found a hand
    if (results.landmarks.length > 0) {

        // First detected hand
        const hand = results.landmarks[0];

        // Index fingertip = landmark 8
        const indexTip = hand[8];

        // Show coordinates
        text.textContent =
            "Index Finger X = " + indexTip.x.toFixed(3) +
            " | Y = " + indexTip.y.toFixed(3);
    }
    else {

        // No hand detected
        text.textContent = "No hand detected";
    }


    // Run detect() again on the next frame
    requestAnimationFrame(detect);
}


// Start detection
detect();
