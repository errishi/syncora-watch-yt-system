import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/Button';

const RoomEndConfirmation = ({ handleEndSession }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="flex-1 sm:flex-none bg-red-950/40 text-red-400 hover:bg-red-950/60 hover:text-red-300 border border-red-900/30 transition-colors">
                    End Session
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">End Party Session?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently end the session, remove all participants, and deactivate the room.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-muted text-foreground border-border hover:bg-muted/80">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEndSession} className="bg-red-950/40 text-red-400 hover:bg-red-950/60 border border-red-900/30">
                        Yes, end session
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default RoomEndConfirmation;