import { LinkIcon } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const ChangeVideoForm = ({ handleUrlChange, inputUrl, setInputUrl }) => {
    return (
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <form onSubmit={handleUrlChange} className="flex gap-3">
                <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Paste YouTube Video URL..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="pl-10 bg-background border-input focus-visible:ring-primary h-12"
                    />
                </div>
                <Button type="submit" className="h-12 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                    Change Video
                </Button>
            </form>
        </div>
    )
}

export default ChangeVideoForm;