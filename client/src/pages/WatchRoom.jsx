import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParticipantList from '../components/ParticipantList';
import Chat from '../components/Chat';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Copy, Link as LinkIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/react';
import { useRoom } from '@/hooks/useRoom';
import { useRoomSocket } from '@/hooks/useRoomSocket';
import VideoPlayer from '@/components/video/VideoPlayer';
import { toast } from 'sonner';
import RoomEndConfirmation from '@/components/video/RoomEndConfirmation';
import ChangeVideoForm from '@/components/video/ChangeVideoForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WatchRoom() {
  const { roomId } = useParams();
  const { userId } = useAuth();
  const { fetchRoomDetails, room, loading, error } = useRoom();
  const navigate = useNavigate();

  const {
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
  } = useRoomSocket(room, userId, navigate);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails(roomId);
    }
  }, [roomId, fetchRoomDetails]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(roomId);
    toast.info('Room ID copied to clipboard!', { id: 'copy_room_id' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading Syncora Room...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>
    );
  }

  if (room?.isBanned || room?.isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Awaiting Approval</h1>
        <p className="text-muted-foreground mb-4">
          {room?.isBanned 
            ? "You were previously removed from this room." 
            : "The host needs to approve your request to join."}
        </p>
        <p className="text-muted-foreground">A request has been sent to the host.</p>
        <p className="text-sm mt-8 animate-pulse text-primary">Please wait...</p>
      </div>
    );
  }

  if (!room?.room) return null;

  const actualRoom = room.room;
  const currentUsername = room.currentUser?.username || 'Unknown';
  const mongoUserId = room.currentUser?.userId;

  const currentUserParticipant = participants.find(p => p.userId === mongoUserId);
  // currentUserRole is the real-time role from socket events; falls back to HTTP response on initial load
  const currentRole = currentUserRole || currentUserParticipant?.role || room.currentUser?.role;
  const isHost = currentRole === 'host';
  const canManageRoles = currentRole === 'host' || currentRole === 'moderator';
  const canControlVideo = currentRole === 'host' || currentRole === 'moderator';

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-[1600px] mx-auto w-full relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm gap-4"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-foreground">Room: <span className="text-primary tracking-widest">{actualRoom.roomCode}</span></h2>
          <Badge variant="outline" className="border-primary text-primary"><span className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse"></span> Live</Badge>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={copyInviteLink} className="flex-1 sm:flex-none bg-card text-primary border-primary/30 hover:bg-primary/15 hover:text-primary hover:border-primary">
            <Copy className="w-4 h-4 mr-2" /> Invite
          </Button>

          {isHost && (
            <RoomEndConfirmation handleEndSession={handleEndSession} />
          )}

          <Button onClick={() => navigate('/')} size="icon" title="Leave Room" className="bg-red-950/40 text-red-400 hover:bg-red-950/60 hover:text-red-300 border border-red-900/30 transition-colors">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Left Column: Video & Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col gap-6"
        >
          <VideoPlayer
            url={videoUrl}
            socket={socket}
            roomCode={actualRoom.roomCode}
            userId={userId}
            canControlVideo={canControlVideo}
          />

          {canControlVideo && (
            <ChangeVideoForm
              handleUrlChange={handleUrlChange}
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
            />
          )}
        </motion.div>

        {/* Right Column: Participants & Chat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-6 h-[800px] lg:h-auto"
        >
          <div className="flex-1 h-1/2">
            <ParticipantList
              participants={participants}
              canManageRoles={canManageRoles}
              currentUserId={mongoUserId}
              onAssignRole={handleAssignRole}
              onRemoveParticipant={handleRemoveParticipant}
            />
          </div>
          <div className="flex-1 h-1/2">
            <Chat messages={messages} onSendMessage={handleSendMessage} username={currentUsername} canChat={currentRole !== 'viewer'} />
          </div>
        </motion.div>
      </div>

      {isHost && joinRequests.length > 0 && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Join Request</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-semibold text-foreground">{joinRequests[0].username}</span> is requesting to join the room. Do you want to allow them in?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleJoinRequestAction(joinRequests[0].participantId, joinRequests[0].socketId, false, joinRequests[0].username)}>Deny</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleJoinRequestAction(joinRequests[0].participantId, joinRequests[0].socketId, true, joinRequests[0].username)}>Approve</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
