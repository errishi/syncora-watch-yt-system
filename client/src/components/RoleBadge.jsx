import React from 'react';
import { Badge } from './ui/Badge';
import { Crown, ShieldCheck, User } from 'lucide-react';

export default function RoleBadge({ role }) {
  if (role === 'host') {
    return (
      <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1 hover:bg-primary/30">
        <Crown className="w-3 h-3" /> Host
      </Badge>
    );
  }
  
  if (role === 'moderator') {
    return (
      <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 flex items-center gap-1 hover:bg-secondary/30">
        <ShieldCheck className="w-3 h-3" /> Moderator
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-muted-foreground border-white/10 flex items-center gap-1">
      <User className="w-3 h-3" /> Participant
    </Badge>
  );
}
