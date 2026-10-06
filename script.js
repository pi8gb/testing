import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const cursor = document.getElementById("cursor");


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


// Wait until video is ready
video.addEventListener("loadeddata", () => {
    detect();
});


function detect() {

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );


    if (results.landmarks.length > 0) {

        const hand = results.landmarks[0];

        // Index fingertip
        const indexTip = hand[8];

        // Mirror X because the camera is mirrored
        const x = 1 - indexTip.x;
        const y = indexTip.y;

        // Convert 0–1 coordinates to pixels
        const cursorX = x * 190;
        const cursorY = y * 190;

        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";
    }


    requestAnimationFrame(detect);
}
