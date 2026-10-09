import React from 'react'
import { motion } from 'framer-motion';
import { MonitorPlay, Play, Users } from 'lucide-react';

const HowToUse = () => {
    const premiumEasing = [0.25, 0.1, 0.25, 1];

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">How Syncora Works</h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Get started in seconds. No complicated setups, no account required for guests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting lines for desktop */}
                <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-border/50 -translate-y-1/2 z-0" />

                {[
                    {
                        step: "01",
                        title: "Create a Room",
                        desc: "Click 'Start a Watch Party', enter your name, and generate a secure, private room in one click.",
                        icon: <MonitorPlay className="w-6 h-6 text-primary" />
                    },
                    {
                        step: "02",
                        title: "Invite Friends",
                        desc: "Copy your unique room link or code and share it with friends anywhere.",
                        icon: <Users className="w-6 h-6 text-secondary-foreground" />
                    },
                    {
                        step: "03",
                        title: "Watch in Sync",
                        desc: "Paste a YouTube URL. Play, pause, and seek—everyone's video stays perfectly synchronized.",
                        icon: <Play className="w-6 h-6 text-primary" />
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: premiumEasing }}
                        className="bg-card p-8 rounded-3xl border border-white/10 shadow-sm relative z-10 hover:border-primary/30 transition-colors duration-300 group"
                    >
                        <div className="absolute -top-4 -left-4 text-6xl font-black text-muted-foreground/10 group-hover:text-primary/10 transition-colors duration-300 pointer-events-none">
                            {feature.step}
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default HowToUse;