import { useEffect, useRef, useState, useMemo } from 'react';

export function useVideoPlayerSocket({ url, socket, roomCode, userId, canControlVideo }) {
    const playerRef = useRef(null);
    const isRemoteAction = useRef(false); // Prevents infinite WebSocket loops
    const lastKnownPlayState = useRef('paused'); // Tracks the true room state
    const hasInitialSync = useRef(false); // Prevents broadcasting fake events on mount
    const [videoId, setVideoId] = useState('');

    // YouTube ID URL formats
    useEffect(() => {
        if (url) {
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (match && match[1]) {
                setVideoId(match[1]);
            } else {
                setVideoId(url);
            }
        }
    }, [url]);

    // Force unmute if user loses video control permission
    useEffect(() => {
        if (!canControlVideo && playerRef.current) {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
        }
    }, [canControlVideo]);

    // incoming Socket.IO events to synchronize playback
    useEffect(() => {
        if (!socket) return;

        const handleRemotePlay = ({ timestamp }) => {
            if (playerRef.current) {
                lastKnownPlayState.current = 'playing';
                isRemoteAction.current = true;
                playerRef.current.seekTo(timestamp, true);
                playerRef.current.playVideo();
                setTimeout(() => { isRemoteAction.current = false; }, 500);
            }
        };

        const handleRemotePause = ({ timestamp }) => {
            if (playerRef.current) {
                lastKnownPlayState.current = 'paused';
                isRemoteAction.current = true;
                playerRef.current.seekTo(timestamp, true);
                playerRef.current.pauseVideo();
                setTimeout(() => { isRemoteAction.current = false; }, 500);
            }
        };

        const handleRemoteSeek = ({ timestamp }) => {
            if (playerRef.current) {
                isRemoteAction.current = true;
                playerRef.current.seekTo(timestamp, true);
                setTimeout(() => { isRemoteAction.current = false; }, 500);
            }
        };

        const handleSyncState = ({ playState, currentTime }) => {
            if (playerRef.current) {
                hasInitialSync.current = true;
                lastKnownPlayState.current = playState;
                isRemoteAction.current = true;
                playerRef.current.seekTo(currentTime, true);
                if (playState === "playing") {
                    playerRef.current.playVideo();
                } else {
                    playerRef.current.pauseVideo();
                }
                setTimeout(() => { isRemoteAction.current = false; }, 500);
            }
        };

        socket.on('play', handleRemotePlay);
        socket.on('pause', handleRemotePause);
        socket.on('seek', handleRemoteSeek);
        socket.on('sync_state', handleSyncState);

        return () => {
            socket.off('play', handleRemotePlay);
            socket.off('pause', handleRemotePause);
            socket.off('seek', handleRemoteSeek);
            socket.off('sync_state', handleSyncState);
        };
    }, [socket]);

    // Handle tab visibility changes to resync video
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && socket && roomCode) {
                socket.emit("request_sync", { roomCode });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [socket, roomCode]);

    //YouTube Player Event Handlers (Broadcasting to others)
    const onReady = (event) => {
        playerRef.current = event.target;
        if (!canControlVideo) {
            event.target.unMute();
            event.target.setVolume(100);
        }
        
        if (socket && roomCode) {
            socket.emit("request_sync", { roomCode });
        }
    };

    const onPlay = (event) => {
        if (!canControlVideo || !hasInitialSync.current) return;
        
        if (isRemoteAction.current) {
            isRemoteAction.current = false;
            return;
        }
        const currentTime = event.target.getCurrentTime();
        socket.emit('play', { roomCode, userId, timestamp: currentTime });
    };

    const onPause = (event) => {
        if (!canControlVideo || !hasInitialSync.current) return;
        
        if (isRemoteAction.current) {
            isRemoteAction.current = false;
            return;
        }
        
        if (document.hidden && lastKnownPlayState.current === 'playing') {
            isRemoteAction.current = true;
            event.target.playVideo();
            return;
        }

        const currentTime = event.target.getCurrentTime();
        socket.emit('pause', { roomCode, userId, timestamp: currentTime });
    };

    // YouTube player styling and configuration
    const opts = useMemo(() => ({
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            controls: canControlVideo ? 1 : 0,
            disablekb: canControlVideo ? 0 : 1,
        },
    }), [canControlVideo]);

    return {
        videoId,
        opts,
        onReady,
        onPlay,
        onPause
    };
}
