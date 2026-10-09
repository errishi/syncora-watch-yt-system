import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-card/30 backdrop-blur-3xl mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="w-full lg:w-1/3 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/logo.svg" alt="Syncora" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Experience YouTube in perfect sync. Watch together, chat in real-time, and never count down to press play again.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="bg-foreground rounded-full hover:bg-foreground/90 transition-colors">
                <img width="25" height="25" src="https://img.icons8.com/fluency-systems-regular/48/facebook-new--v1.png" alt="facebook-new--v1"/>
              </a>
              <a href="#" className="bg-foreground rounded-full hover:bg-foreground/90 transition-colors px-0.5">
                <img width="25" height="25" src="https://img.icons8.com/fluency-systems-regular/48/youtube-play.png" alt="youtube-play"/>
              </a>
              <a href="#" className="bg-foreground rounded-full hover:bg-foreground/90 transition-colors p-0.5">
                <img width="22" height="22" src="https://img.icons8.com/fluency-systems-regular/48/twitter.png" alt="twitter"/>
              </a>
              <a href="#" className="bg-foreground rounded-full hover:bg-foreground/90 transition-colors p-0.5">
                <img width="22" height="22" src="https://img.icons8.com/fluency-systems-regular/48/instagram-new--v1.png" alt="instagram-new--v1"/>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12 lg:pl-12">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Room</Link></li>
                <li><Link to="/join" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join Room</Link></li>
                <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guidelines</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Syncora. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Developed by</span>
            <span>Rishikesh Singh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}