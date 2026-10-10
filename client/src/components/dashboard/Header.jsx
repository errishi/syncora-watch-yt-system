import React from 'react'
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/AuthContext';
import { BadgeCheck, User } from 'lucide-react';

const Header = () => {
    const { user } = useUser();
    const premiumEasing = [0.25, 0.1, 0.25, 1];
    
    // Fallback if user is null for a split second during loading
    if (!user) return null;

    const displayName = user.user_metadata?.full_name || user.email.split('@')[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: premiumEasing }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/20"
        >
            <div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Welcome back, {displayName}!</h1>
                <p className="text-muted-foreground">Manage your watch parties, track history, and check your stats.</p>
            </div>
            <div className="flex items-center gap-4 bg-card/30 border border-white/20 p-2 pr-6 rounded-full backdrop-blur-md">
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="rounded-full w-12 h-12 object-cover" />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{displayName}</span>
                    <span className="text-xs text-primary flex items-center gap-1">Verified <BadgeCheck className="h-3 w-3" /> </span>
                </div>
            </div>
        </motion.div>
    )
}

export default Header;