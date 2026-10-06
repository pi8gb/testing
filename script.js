import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const cursor = document.getElementById("cursor");

async function main() {

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

    // Actually start the video
    await video.play();

    // Wait until we have a usable video frame
    while (video.readyState < 2) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }

    detect();


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

            // 200px area, 10px cursor
            const cursorX = x * 190;
            const cursorY = y * 190;

            cursor.style.left = cursorX + "px";
            cursor.style.top = cursorY + "px";
        }

        requestAnimationFrame(detect);
    }
}

main();
