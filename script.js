
import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const cursor = document.getElementById("cursor");
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
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;
        await video.play();

        detect();
    } catch (error) {
        console.error("Camera access failed:", error);
    }
}

// Detect hand continuously
function detect() {
    if (video.readyState >= 2) {
        const results = handLandmarker.detectForVideo(
            video,
            performance.now()
        );

        if (results.landmarks.length > 0) {
            const hand = results.landmarks[0];
            const indexTip = hand[8];

            const x = 1 - indexTip.x;
            const y = indexTip.y;

            cursor.style.left = (x * 490) + "px";
            cursor.style.top = (y * 490) + "px";
        }
    }

    requestAnimationFrame(detect);
}

startCamera();

