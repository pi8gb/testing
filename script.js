import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const text = document.getElementById("text");


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

        // Landmark 8 = index fingertip
        const indexTip = hand[8];

        text.textContent =
            "X: " + indexTip.x.toFixed(3) +
            " | Y: " + indexTip.y.toFixed(3);

    } else {

        text.textContent = "No hand detected";

    }


    requestAnimationFrame(detect);
}
