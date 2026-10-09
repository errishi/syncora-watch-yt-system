import React from 'react'
import YouTube from 'react-youtube';
import { useVideoPlayerSocket } from '@/hooks/useVideoPlayerSocket';

const VideoPlayer = ({ url, socket, roomCode, userId, canControlVideo }) => {
    const {
        videoId,
        opts,
        onReady,
        onPlay,
        onPause
    } = useVideoPlayerSocket({ url, socket, roomCode, userId, canControlVideo });

    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border">
            {videoId ? (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onPlay={onPlay}
                    onPause={onPause}
                    className={`w-full h-full ${canControlVideo ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    iframeClassName="w-full h-full"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Paste a YouTube link below to start watching
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;