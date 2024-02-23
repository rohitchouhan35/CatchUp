const useVideoFrameSender = (localVideoRef, stompConnection) => {
    const targetFrameRate = 16;
    let lastFrameTime = 0;

    const captureAndSendVideoFrame = () => {
        const currentTime = performance.now();
        const timeSinceLastFrame = currentTime - lastFrameTime;
        const scaleFactor = 0.5;

        if (timeSinceLastFrame >= 1000 / targetFrameRate && localVideoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = localVideoRef.current.videoWidth * scaleFactor;
            canvas.height = localVideoRef.current.videoHeight * scaleFactor;
            const context = canvas.getContext("2d");
            context.drawImage(localVideoRef.current, 0, 0, canvas.width, canvas.height);
            const videoFrame = canvas.toDataURL("image/webp").split(",")[1];

            stompConnection.publish("/app/live-video", videoFrame);

            lastFrameTime = currentTime;
        }
        requestAnimationFrame(captureAndSendVideoFrame);
    };

    return captureAndSendVideoFrame;
};

export default useVideoFrameSender;
