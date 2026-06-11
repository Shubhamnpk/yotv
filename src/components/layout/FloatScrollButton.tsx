import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function FloatScrollButton() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;

      setIsAtTop(scrollY < 100);

      // Show button if we've scrolled at least one viewport height
      // Or if we're not at the very bottom (for scroll down)
      setShowButton(scrollY > windowHeight || scrollY < docHeight - windowHeight - 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtTop) {
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {showButton && (
        <button
          onClick={handleClick}
          className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label={isAtTop ? 'Scroll to bottom' : 'Scroll to top'}
        >
          {isAtTop ? <ArrowDown className="w-6 h-6" /> : <ArrowUp className="w-6 h-6" />}
        </button>
      )}
    </>
  );
}