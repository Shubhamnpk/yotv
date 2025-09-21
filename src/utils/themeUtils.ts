export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // fallback
}

export function applyTheme(theme: 'system' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange' | 'light-blue' | 'light-purple' | 'light-green' | 'light-red' | 'light-orange' | 'dark-brown' | 'light-brown') {
  // Remove all theme classes
  document.documentElement.classList.remove(
    'light', 'dark',
    'theme-dark-blue', 'theme-dark-purple', 'theme-dark-green', 'theme-dark-red', 'theme-dark-orange',
    'theme-light-blue', 'theme-light-purple', 'theme-light-green', 'theme-light-red', 'theme-light-orange',
    'theme-dark-brown', 'theme-light-brown'
  );

  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    // For system, apply light-blue if light, dark-blue if dark
    if (systemTheme === 'dark') {
      document.documentElement.classList.add('dark', 'theme-dark-blue');
    } else {
      document.documentElement.classList.add('light', 'theme-light-blue');
    }
  } else {
    // For other themes, add the corresponding classes
    const isDark = theme.startsWith('dark-');
    document.documentElement.classList.add(isDark ? 'dark' : 'light', `theme-${theme}`);
  }
}

export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void) {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
  };
}