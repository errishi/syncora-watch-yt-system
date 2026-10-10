import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

export function useRoomSocket(room, userId, navigate, fetchRoomDetails) {
  const [videoUrl, setVideoUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const mongoUserIdRef = useRef(null);

  useEffect(() => {
    if (room?.room) {
      setVideoUrl(room.room.videoId || '');
      setParticipants(room.room.participants || []);
    }
    if (room?.currentUser) {
      mongoUserIdRef.current = room.currentUser.userId?.toString();
      setCurrentUserRole(room.currentUser.role);
    }
  }, [room]);

  useEffect(() => {
    if (room?.room && userId) {
      const actualRoom = room.room;
      const currentUsername = room.currentUser?.username || 'Unknown';

      socket.emit('join_room', {
        roomCode: actualRoom.roomCode,
        userId,
        username: currentUsername
      });

      const onChangeVideo = (payload) => {
        setVideoUrl(payload.videoId);
      };

      const onSyncState = (payload) => {
        if (payload.videoId) {
          setVideoUrl(payload.videoId);
        }
      };

      const onUserJoined = (payload) => {
        setParticipants(payload.participants);
        const me = payload.participants.find(p => p.userId?.toString() === mongoUserIdRef.current);
        if (me) setCurrentUserRole(me.role);

        if (payload.userId !== userId && payload.userId !== room.currentUser?.userId) {
          toast.success(`${payload.username} joined the room`, { id: `user_joined_${payload.userId}` });
        }
      };

      const onUserLeft = (payload) => {
        setParticipants(payload.participants);
        if (payload.userId !== userId && payload.userId !== room.currentUser?.userId) {
          toast.info(`${payload.username} left the room`, { id: `user_left_${payload.userId}` });
        }
      };

      const onRoleAssigned = (payload) => {
        setParticipants(payload.participants);
        if (payload.userId?.toString() === mongoUserIdRef.current) {
          setCurrentUserRole(payload.role);
          toast.success(`You have been made a ${payload.role}`, { id: 'my_role_changed' });
        } else {
          toast.info(payload.message || `Role of ${payload.username} has been changed to ${payload.role}`, { id: `role_assigned_${payload.userId}` });
        }
      };

      const onParticipantRemoved = (payload) => {
        setParticipants(payload.participants);
        if (payload.userId?.toString() === mongoUserIdRef.current) {
          toast.error("You have been removed from the room", { id: 'you_removed' });
          navigate('/');
        } else {
          toast.info(payload.message || "A participant has been removed from the room", { id: `participant_removed_${payload.userId}` });
        }
      };

      const onSessionEnded = (payload) => {
        toast.info(payload.message || "The session has been ended by the host.", { id: 'session_ended' });
        navigate('/');
      };

      const onError = (payload) => {
        toast.error(payload.message || "An error occurred", { id: 'socket_error' });
      };

      const onWaitingForApproval = (payload) => {
        toast.info(payload.message, { id: 'waiting_for_approval' });
      };

      const onJoinRequest = (payload) => {
        setJoinRequests(prev => [...prev, payload]);
      };

      const onJoinRequestApproved = () => {
        toast.success("Host approved your request. Joining...", { id: 'join_approved' });
        if (fetchRoomDetails && actualRoom.roomCode) {
            fetchRoomDetails(actualRoom.roomCode);
        }
      };

      const onJoinRequestDenied = () => {
        toast.error("Host denied your request to join.", { id: 'join_denied' });
        navigate('/');
      };

      const onChatMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
        toast.info(`${msg.sender}: ${msg.text.length > 40 ? msg.text.substring(0, 40) + '...' : msg.text}`, { id: `chat_${msg.id}` });
      };

      socket.on('change_video', onChangeVideo);
      socket.on('sync_state', onSyncState);
      socket.on('user_joined', onUserJoined);
      socket.on('user_left', onUserLeft);
      socket.on('role_assigned', onRoleAssigned);
      socket.on('participant_removed', onParticipantRemoved);
      socket.on('session_ended', onSessionEnded);
      socket.on('error', onError);
      socket.on('waiting_for_approval', onWaitingForApproval);
      socket.on('join_request', onJoinRequest);
      socket.on('join_request_approved', onJoinRequestApproved);
      socket.on('join_request_denied', onJoinRequestDenied);
      socket.on('chat_message', onChatMessage);

      return () => {
        socket.emit('leave_room', {
          roomCode: actualRoom.roomCode,
          userId,
          username: currentUsername
        });

        socket.off('change_video', onChangeVideo);
        socket.off('sync_state', onSyncState);
        socket.off('user_joined', onUserJoined);
        socket.off('user_left', onUserLeft);
        socket.off('role_assigned', onRoleAssigned);
        socket.off('participant_removed', onParticipantRemoved);
        socket.off('session_ended', onSessionEnded);
        socket.off('error', onError);
        socket.off('waiting_for_approval', onWaitingForApproval);
        socket.off('join_request', onJoinRequest);
        socket.off('join_request_approved', onJoinRequestApproved);
        socket.off('join_request_denied', onJoinRequestDenied);
        socket.off('chat_message', onChatMessage);
      };
    };
  }, [room, userId, navigate]);

  const handleUrlChange = (e) => {
    e.preventDefault();
    if (inputUrl) {
      setVideoUrl(inputUrl);

      socket.emit('change_video', {
        roomCode: room?.room?.roomCode,
        videoId: inputUrl,
        userId
      });

      setInputUrl('');
    }
  };

  const handleSendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    socket.emit('chat_message', {
      roomCode: room?.room?.roomCode,
      message: msg
    });
  };

  const handleAssignRole = (targetUserId, newRole) => {
    socket.emit("assign_role", {
      roomCode: room?.room?.roomCode,
      requesterId: userId,
      targetUserId,
      newRole
    });
  };

  const handleRemoveParticipant = (targetUserId) => {
    socket.emit("remove_participant", {
      roomCode: room?.room?.roomCode,
      requesterId: userId,
      targetUserId
    });
  };

  const handleEndSession = () => {
    socket.emit("end_session", {
      roomCode: room?.room?.roomCode,
      requesterId: userId
    });
  };

  const handleJoinRequestAction = (targetParticipantId, targetSocketId, approve, targetUsername) => {
    socket.emit("handle_join_request", {
      roomCode: room?.room?.roomCode,
      requesterId: userId,
      targetParticipantId,
      targetSocketId,
      targetUsername,
      approve
    });
    setJoinRequests(prev => prev.filter(req => req.socketId !== targetSocketId));
  };

  return {
    socket,
    videoUrl,
    inputUrl,
    setInputUrl,
    messages,
    participants,
    joinRequests,
    currentUserRole,
    handleUrlChange,
    handleSendMessage,
    handleAssignRole,
    handleRemoveParticipant,
    handleEndSession,
    handleJoinRequestAction
  };
}
