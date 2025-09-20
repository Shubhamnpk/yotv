export function formatRelativeTime(timestamp: number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = timestamp - Date.now();
  const diffAbs = Math.abs(diff);

  const minutes = Math.floor(diffAbs / (1000 * 60));
  const hours = Math.floor(diffAbs / (1000 * 60 * 60));
  const days = Math.floor(diffAbs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 7) {
    return rtf.format(-days, 'day');
  } else {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}