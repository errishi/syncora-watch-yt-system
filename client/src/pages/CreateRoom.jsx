import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoom } from '../hooks/useRoom';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export default function CreateRoom() {
  const { handleCreateRoom, loading } = useRoom();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (displayName) {
        localStorage.setItem('syncora_display_name', displayName);
      }
      const data = await handleCreateRoom({ displayName, roomName });
      if(data.success){
        toast.success(data.message || 'Room created successfully!', { id: 'room_created' });
        navigate(`/room/${data.room.roomCode}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create room', { id: 'room_create_error' });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative py-20">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/10 border border-primary/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-sm">
              <MonitorPlay className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Create a Room</CardTitle>
            <CardDescription className="text-muted-foreground">Start a new watch party and invite friends.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Your Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Enter your display name" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background border-input focus-visible:ring-primary h-12 shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomName" className="text-sm font-medium text-foreground">Room Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="roomName" 
                  placeholder="e.g. Movie Night" 
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-background border-input focus-visible:ring-primary h-12 shadow-sm"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-md shadow-md shadow-primary/20">
                {loading ? 
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Room... 
                </> : 'Create & Join Room'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
