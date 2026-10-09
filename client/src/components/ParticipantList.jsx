import React from 'react';
import ParticipantItem from './ParticipantItem';
import { Users } from 'lucide-react';

export default function ParticipantList({ participants, canManageRoles, currentUserId, onAssignRole, onRemoveParticipant }) {
  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
          <Users className="w-4 h-4 text-primary" />
          Participants
        </h3>
        <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border">
          {participants.length} online
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-card">
        {participants.map((p) => (
          <ParticipantItem 
            key={p.userId} 
            participant={p} 
            canManageRoles={canManageRoles}
            currentUserId={currentUserId}
            onAssignRole={onAssignRole}
            onRemoveParticipant={onRemoveParticipant}
          />
        ))}
      </div>
    </div>
  );
}
