import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const cursor = document.getElementById("cursor");
const status = document.getElementById("status");

async function main() {

    status.textContent = "Loading MediaPipe...";

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

    status.textContent = "Starting camera...";

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });

    video.srcObject = stream;

    await video.play();

    status.textContent = "Camera ready";

    function detect() {

        const results = handLandmarker.detectForVideo(
            video,
            performance.now()
        );

        if (results.landmarks.length > 0) {

            status.textContent = "HAND DETECTED";

            const indexTip = results.landmarks[0][8];

            // Convert MediaPipe 0-1 coordinates to 200px
            const x = (1 - indexTip.x) * 190;
            const y = indexTip.y * 190;

            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

        } else {

            status.textContent = "NO HAND";
        }

        requestAnimationFrame(detect);
    }

    detect();
}

main().catch(error => {
    console.error(error);
    status.textContent = "ERROR: " + error.message;
});
