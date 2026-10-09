import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Eye, Clock, MonitorPlay, MessageSquare, Zap, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import HowToUse from '../components/home/howToUse';
import Features from '../components/home/Features';

export default function Home() {
  const rooms = [
    { id: 'ABX729', title: 'Lofi Girl Live - Beats to relax/study to', viewers: 124, time: 'Live', thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800' },
    { id: 'MKP301', title: 'MKBHD: iPhone 16 Pro Review!', viewers: 42, time: '2h ago', thumbnail: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800' },
    { id: 'TRX912', title: 'Formula 1 Highlights - Monaco GP', viewers: 89, time: 'Live', thumbnail: 'https://images.unsplash.com/photo-1517409277028-21d120a232f3?auto=format&fit=crop&q=80&w=800' },
    { id: 'JXZ219', title: 'Elden Ring DLC Trailer Reaction', viewers: 21, time: '5h ago', thumbnail: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800' }
  ];

  // Professional, subtle easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <div className="flex-1 flex flex-col w-full relative">
      
      <div className="absolute inset-0 z-[-20] h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="space-y-24 py-16">
        {/* Hero Section */}
        <section className="text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: premiumEasing }}
          >
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary font-medium text-sm mb-8">
              ✨ Syncora is now live
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: premiumEasing }}
            className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6"
          >
            Experience <span className="inline-block rounded-[0.2em] bg-[#ff0000] px-[0.18em] py-[0.02em] align-baseline text-white">You</span><span className="text-[#ff0000]">Tube</span> <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              in Perfect Sync.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: premiumEasing }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create a room, invite your friends, and watch videos together. Real-time chat, synchronized playback, and absolutely zero countdowns.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: premiumEasing }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          >
            <Link to="/create">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-semibold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-300 transform">
                <MonitorPlay className="w-5 h-5 mr-2" /> Start a Watch Party
              </Button>
            </Link>
            <Link to="/join">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-semibold border border-white/20 hover:bg-muted transition-all duration-300 group">
                Join Room <ChevronRight className="w-4 h-4 ml-1 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Hero Mockup Graphic */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: premiumEasing }}
          className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-2 sm:px-4"
        >
          <div className="rounded-2xl border border-white/20 bg-card/50 p-1.5 shadow-[0_0_100px_rgba(108,205,140,0.1)] backdrop-blur-3xl sm:rounded-3xl sm:p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black shadow-inner sm:aspect-video sm:rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=1600" 
                alt="App Mockup" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 sm:h-16 sm:w-16">
                    <Play className="ml-0.5 h-6 w-6 fill-primary-foreground text-primary-foreground sm:ml-1 sm:h-8 sm:w-8" />
                  </div>
                  <div className="min-w-0 text-white">
                    <p className="text-sm font-semibold leading-tight drop-shadow-md sm:text-lg">Playing: MKBHD - iPhone 16 Pro Review</p>
                    <p className="mt-1 text-xs leading-tight text-white/80 sm:text-sm">Synchronized with 4 others • 02:14 / 14:05</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How to Use Section */}
        <HowToUse />

        {/* Features Section */}
        <Features />

        {/* Trending Rooms Section */}
        <section id="trending" className="max-w-6xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center">
              Trending Rooms
            </h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold group">
              View All <ChevronRight className="w-4 h-4 ml-1 text-primary/70 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room, i) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: premiumEasing }}
              >
                <Link to={`/room/${room.id}`} state={{ username: 'Guest', isHost: false }}>
                  <Card className="group cursor-pointer bg-card border-white/20 hover:border-primary/40 transition-colors duration-300 overflow-hidden rounded-2xl shadow-sm hover:shadow-md">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {/* Subtle image scaling on hover instead of lifting the whole card */}
                      <img 
                        src={room.thumbnail} 
                        alt={room.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                      <div className="absolute bottom-2 left-2 flex gap-2">
                        {room.time === 'Live' && (
                          <Badge className="bg-destructive text-destructive-foreground border-none shadow-sm font-semibold">LIVE</Badge>
                        )}
                        <Badge className="bg-black/60 text-white border-none backdrop-blur-md">
                          <Eye className="w-3 h-3 mr-1" /> {room.viewers}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        {/* Play button fades in gently */}
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 text-base">{room.title}</h3>
                      <div className="flex items-center text-xs font-medium text-muted-foreground mt-3 space-x-3">
                        <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> {room.viewers}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {room.time}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
