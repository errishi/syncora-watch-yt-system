import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MonitorPlay, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] w-full relative my-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: premiumEasing }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="relative mb-8 w-full flex justify-center">
          <h1 className="text-[5.5rem] sm:text-[8rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/5 leading-none select-none whitespace-nowrap">
            4 &nbsp;&nbsp; 4
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-card/80 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center shadow-primary/20 mt-2 sm:mt-0">
              <MonitorPlay className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
          Stream Not Found
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Looks like this room doesn't exist, or the link you followed is broken. Let's get you back to the main lobby.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 h-12 px-8 font-semibold transition-all">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto rounded-full h-12 px-8 border-border hover:bg-muted text-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
