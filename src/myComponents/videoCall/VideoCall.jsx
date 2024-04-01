import React, { useEffect } from 'react'
import './VideoCall.css'

export default function VideoCall() {

    useEffect(() => {
        // Get video element
        const video = document.getElementById('video');

        // Function to start video stream
        const startVideo = async () => {
            alert(`${window.navigator.mediaDevices.getUserMedia}`)
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        }
        startVideo()
    }, [])

    return (
        <div className='call-window'>
            <video id="video" autoplay></video>
        </div>
    )
}
