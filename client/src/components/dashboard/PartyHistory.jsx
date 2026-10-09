import React from 'react';
import { Play, Users, Clock, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

export default function PartyHistory({ historyData }) {
  const history = historyData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Party History</h2>
        <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-foreground">
          View Full History
        </Button>
      </div>

      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-card/10 rounded-xl border border-white/5">
            <p className="text-muted-foreground">No party history found. Join or create a room to get started!</p>
          </div>
        ) : (
          history.map((party) => (
          <Card key={party.id} className="bg-card/30 backdrop-blur-md border border-white/20 overflow-hidden hover:bg-card/50 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
              
              {/* Thumbnail */}
              <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                <img src={party.thumbnail} alt={party.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/50" />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-wider">
                    {party.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{party.id}</span>
                  
                  {party.status === 'Active' ? (
                    <Badge variant="outline" className="border-primary text-primary ml-auto flex items-center h-5 text-[10px]">
                      <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-1.5 animate-pulse"></span> Live Now
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 text-muted-foreground ml-auto h-5 text-[10px]">
                      Completed
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg text-foreground truncate mb-2">
                  {party.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> {party.date}</span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> {party.duration}</span>
                  <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1.5" /> {party.participants} members</span>
                </div>
              </div>

              {/* Action */}
              {party.status === 'Active' && (
                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-2 shrink-0">
                  <Link to={`/room/${party.id}`}>
                    <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                      Join Party
                    </Button>
                  </Link>
                </div>
              )}

            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
