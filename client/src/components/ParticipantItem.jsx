import React from 'react';
import { Avatar, AvatarFallback } from './ui/Avatar';
import RoleBadge from './RoleBadge';
import { MoreVertical, UserX } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ParticipantItem({ participant, canManageRoles, currentUserId, onAssignRole, onRemoveParticipant }) {
  const isMe = participant.userId === currentUserId;
  // Prevent managing oneself or the host (unless you have a special UI for host transfers, which we omit here)
  const showMenu = canManageRoles && !isMe && participant.role !== 'host';

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 border border-border group-hover:border-primary/50 transition-colors bg-background shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {participant.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
            {participant.username} 
            {isMe && <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-primary/10 hover:bg-primary/10 text-primary border-primary/20 pointer-events-none">You</Badge>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <RoleBadge role={participant.role} />
        
        {showMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-100 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participant.role !== 'moderator' && (
                  <DropdownMenuItem onClick={() => onAssignRole(participant.userId, 'moderator')}>
                    Make Moderator
                  </DropdownMenuItem>
              )}
              {participant.role !== 'participant' && (
                  <DropdownMenuItem onClick={() => onAssignRole(participant.userId, 'participant')}>
                    Make Participant
                  </DropdownMenuItem>
              )}
              {participant.role !== 'viewer' && (
                  <DropdownMenuItem onClick={() => onAssignRole(participant.userId, 'viewer')}>
                    Make Viewer
                  </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => onRemoveParticipant(participant.userId)}>
                <UserX className="h-4 w-4 mr-2" /> Remove from Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
