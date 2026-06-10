import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * FloatScrollButton renders two floating action buttons:
 *   - Scroll Down: jumps to the bottom of the page.
 *   - Scroll Up: appears after scrolling down and scrolls back to top.
 * The component is positioned at the bottom‑right corner and uses smooth scrolling.
 */
export default function FloatScrollButton() {
  const [showUp, setShowUp] = useState(false);

  // Show the "up" button after the user scrolls a certain distance.
  useEffect(() => {
    const handleScroll = () => {
      setShowUp(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (position: 'top' | 'bottom') => {
    const y = position === 'top' ? 0 : document.body.scrollHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-40">
      {/* Scroll Down button */}
      <button
        onClick={() => scrollTo('bottom')}
        className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="w-6 h-6" />
      </button>

      {/* Scroll Up button – only visible after scrolling */}
      {showUp && (
        <button
          onClick={() => scrollTo('top')}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
