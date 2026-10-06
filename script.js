import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const cursor = document.getElementById("cursor");

// Create invisible video element
const video = document.createElement("video");

video.autoplay = true;
video.playsInline = true;


// Load MediaPipe
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
        numHands: 1
    }
);


// Start camera
const stream = await navigator.mediaDevices.getUserMedia({
    video: true
});

video.srcObject = stream;

await video.play();


// Detect hand continuously
function detect() {

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );

    if (results.landmarks.length > 0) {

        const hand = results.landmarks[0];

        // Landmark 8 = index fingertip
        const indexTip = hand[8];

        // Mirror X
        const x = 1 - indexTip.x;
        const y = indexTip.y;

        // 500px area - 10px cursor
        const cursorX = x * 490;
        const cursorY = y * 490;

        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";
    }

    requestAnimationFrame(detect);
}

detect();
