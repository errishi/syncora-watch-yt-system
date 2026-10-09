import React from 'react'
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="flex w-full items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        </div>
    )
}

export default LoadingScreen;