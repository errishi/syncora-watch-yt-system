import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoom } from '@/hooks/useRoom';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export default function JoinRoom() {
  const { handleJoinRoom, loading } = useRoom();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      if (displayName) {
        localStorage.setItem('syncora_display_name', displayName);
      }
      const data = await handleJoinRoom({ displayName, roomCode: roomId });
      if(data.success){
        // Only show a toast for successful direct joins.
        // Waiting/banned states are handled by the socket (waiting_for_approval event).
        if (!data.isWaiting && !data.isBanned) {
          toast.success(data.message || 'Joined room successfully!', { id: 'room_joined' });
        }
        navigate(`/room/${data.room.roomCode}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to join room', { id: 'room_join_error' });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative py-20">
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-secondary/20 border border-secondary/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-sm">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Join a Room</CardTitle>
            <CardDescription className="text-muted-foreground">Enter a room code to join the party.</CardDescription>
          </CardHeader>
          <form onSubmit={handleJoin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Your Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Enter your display name" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background border-input focus-visible:ring-secondary h-12 shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-sm font-medium text-foreground">Room Code <span className="text-destructive">*</span></Label>
                <Input 
                  id="roomId" 
                  placeholder="e.g. ABX729" 
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="bg-background border-input focus-visible:ring-secondary h-12 uppercase shadow-sm"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-12 text-md shadow-md shadow-secondary/20">
                {loading ? 
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining... 
                </> : 'Join Room'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
