import React from 'react';
import { MessageSquare, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { 
        icon: <Zap className="w-6 h-6 text-primary" />, 
        title: "Zero Latency Sync", 
        desc: "Our WebSocket architecture ensures playback is perfectly synchronized down to the millisecond for every participant." 
    },
    { 
        icon: <MessageSquare className="w-6 h-6 text-primary" />, 
        title: "Real-time Interactions", 
        desc: "Chat, react, and discuss moments instantly with an integrated real-time messaging system." 
    },
    { 
        icon: <Users className="w-6 h-6 text-primary" />, 
        title: "Seamless Invites", 
        desc: "Generate a room code and invite unlimited friends instantly. No account required to join and watch." 
    },
];

const Features = () => {
    const premiumEasing = [0.25, 0.1, 0.25, 1];

    return (
        <section className="max-w-6xl mx-auto px-4 py-20 relative">
            {/* Background ambient light for features section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: premiumEasing }}
                    className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight"
                >
                    Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Performance</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1, ease: premiumEasing }}
                    className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
                >
                    Everything you need for a flawless watch party experience, built on modern web technologies.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: premiumEasing }}
                        className="group relative bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-sm hover:bg-card/60 transition-all duration-300 overflow-hidden"
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:border-primary/30 transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default Features;