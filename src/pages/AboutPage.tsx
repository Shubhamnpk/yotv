import { Tv, Globe, Radio, Monitor, Heart, Github, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Footer } from '../components/layout/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple nav bar */}
      <div className="sticky top-0 z-30 border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-xl border border-border/30 bg-card/20 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Channels
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Tv className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">About YoTV</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Your gateway to global television — watch live news, sports, entertainment
            and more from anywhere in the world.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="rounded-xl border border-border/30 bg-card/20 p-5 space-y-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold">Global Channels</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access hundreds of live TV channels from Nepal, India, the US, UK, and
              beyond — all in one place.
            </p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/20 p-5 space-y-2">
            <Radio className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold">YouTube Live + HLS</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Supports both HLS streaming and YouTube 24/7 live feeds with a
              unified custom player and full DVR seek support.
            </p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/20 p-5 space-y-2">
            <Monitor className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold">Modern Player</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Custom-built video player with progress bar, quality selector,
              picture-in-picture, ambient glow, and full keyboard controls.
            </p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/20 p-5 space-y-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold">Personalised</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Favourites, watch history, 13+ themes, custom colour schemes, and
              smart suggestions by language and category.
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="rounded-xl border border-border/30 bg-card/20 p-6 mb-12">
          <h2 className="text-sm font-bold mb-4">Built With</h2>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'HLS.js', 'Framer Motion', 'Zustand', 'Radix UI'].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center space-y-4">
          <h2 className="text-sm font-bold">Get In Touch</h2>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/Shubhamnpk/yotv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/20 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="mailto:shubhamniraula1@gmail.com"
              className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/20 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            Built with love by Shubham Niraula
          </p>
          <Link
            to="/"
            className="inline-block text-xs text-primary hover:underline mt-2"
          >
            &larr; Back to Channels
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
