import React, { useState } from 'react';
import { Ban, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Avatar, AvatarFallback } from './ui/Avatar';

export default function Chat({ messages, onSendMessage, username, canChat = true }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage({ text, sender: username, id: Date.now() });
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/50">
        <h3 className="font-semibold text-sm text-foreground">Live Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === username ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-8 h-8 border border-border">
                <AvatarFallback className="bg-primary/20 text-xs text-primary font-bold">
                  {msg.sender.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${msg.sender === username ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-muted-foreground mb-1">{msg.sender}</span>
                <div className={`px-3 py-2 max-w-[200px] text-sm break-words shadow-sm ${
                  msg.sender === username 
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                    : 'bg-muted text-foreground border border-border rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {canChat ? (
        <div className="p-3 bg-muted/50 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-background border-input focus-visible:ring-primary rounded-full h-10 px-4"
            />
            <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 shrink-0 shadow-sm">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="p-3 bg-muted/50 border-t border-border flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <span className="text-base">
            <Ban className="w-4 h-4 text-red-500" />  
          </span>
          <span>View-only mode — viewers cannot send messages</span>
        </div>
      )}
    </div>
  );
}
