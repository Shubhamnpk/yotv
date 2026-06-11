import { Tv, Github, Heart, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Tv className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">YoTV</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Your gateway to global television — watch live news, sports,
              entertainment and more from anywhere in the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels by Language */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">Channels</h4>
            <ul className="space-y-2">
              <li className="text-xs text-muted-foreground">Nepali News</li>
              <li className="text-xs text-muted-foreground">International News</li>
              <li className="text-xs text-muted-foreground">Nepal TV</li>
              <li className="text-xs text-muted-foreground">English News</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Shubhamnpk/yotv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:shubhamniraula1@gmail.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact
                </a>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-3.5 w-3.5" />
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} YoTV. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Shubham Niraula
          </p>
        </div>
      </div>
    </footer>
  );
}
