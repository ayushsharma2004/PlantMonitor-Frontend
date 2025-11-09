import { useEffect, useRef, useState } from "react";

export function useVideoPlayback() {
    const videoRef = useRef(null);
    const timeoutRef = useRef(null);
    const [thumbnailError, setThumbnailError] = useState({});

    // Cleanup function to clear any timeouts
    const cleanup = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    // Extract YouTube video ID from a URL
    const getYouTubeId = (url) => {
        if (!url) return null;

        try {
            let videoId;

            if (url.includes("youtu.be")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else {
                videoId = url.split("v=")[1]?.split("&")[0];
            }

            if (!videoId) return null;
            return videoId;
        } catch (error) {
            console.error("Error extracting YouTube ID:", error);
            return null;
        }
    };

    // Get YouTube thumbnail URL from video ID
    const getYouTubeThumbnailUrl = (videoId) => {
        if (!videoId) return '';
        // Use hqdefault.jpg instead of maxresdefault.jpg for better compatibility
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    // Handle thumbnail loading error
    const handleThumbnailError = (videoId) => {
        setThumbnailError(prev => ({ ...prev, [videoId]: true }));
    };

    // Get appropriate thumbnail URL
    const getThumbnailUrl = (video) => {
        if (video.public && video.link) {
            const videoId = getYouTubeId(video.link);
            if (videoId && !thumbnailError[videoId]) {
                return getYouTubeThumbnailUrl(videoId);
            }
        } else
            if (video.public && video.videoLink) {
                const videoId = getYouTubeId(video.videoLink);
                if (videoId && !thumbnailError[videoId]) {
                    return getYouTubeThumbnailUrl(videoId);
                }
            }

        // Return the provided imageUrl or empty string if none exists
        return video.imageUrl || '';
    };

    // Play a private video with 10 second limit
    const playPrivateVideo = (element) => {
        videoRef.current = element;

        // Add timeupdate event listener to prevent playing beyond 10 seconds
        const handleTimeUpdate = () => {
            if (element && element.currentTime >= 10) {
                element.pause();
                element.currentTime = 10; // Keep it at exactly 10 seconds
            }
        };

        // Remove previous listener if any
        element.removeEventListener("timeupdate", handleTimeUpdate);

        // Add the listener
        element.addEventListener("timeupdate", handleTimeUpdate);

        // Auto-play for 10 seconds then pause
        element.play().catch((err) => console.error("Video playback failed:", err));

        timeoutRef.current = window.setTimeout(() => {
            if (element) {
                element.pause();
            }
        }, 11000);

        // Store the listener cleanup in the timeoutRef
        const originalCleanup = cleanup;
        cleanup.toString = () => {
            element.removeEventListener("timeupdate", handleTimeUpdate);
            return originalCleanup.toString();
        };
    };

    // Format date from timestamp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Check if the video is playable (has either link or videoUrl)
    const isPlayable = (video) => {
        return Boolean((video.public && video.link) || (!video.public && video.videoUrl));
    };

    // Check if the my video is playable (has either link or videoUrl)
    const isMyPlayable = (video) => {
        return Boolean((video.public && video.videoLink) || (!video.public && video.videoUrl));
    };

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, []);

    return {
        getYouTubeId,
        getYouTubeThumbnailUrl,
        getThumbnailUrl,
        handleThumbnailError,
        playPrivateVideo,
        formatDate,
        isPlayable,
        isMyPlayable,
        cleanup
    };
}