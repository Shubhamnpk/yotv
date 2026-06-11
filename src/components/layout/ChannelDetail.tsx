import React from 'react';
import { Channel } from '../../types';

/**
 * ChannelDetail component displays detailed information about the channel.
 * It shows the channel name, category list, country, and language information.
 */
export default function ChannelDetail({ channel }: { channel: Channel }) {
  return (
    <div className="mt-6 space-y-2">
      <h2 className="text-2xl font-bold text-foreground">{channel.name}</h2>
      <p className="text-muted-foreground">
        {channel.categories.map((c) => c).join(', ') || 'No categories'}
      </p>
      <p className="text-sm text-muted-foreground">
        {channel.countryName ?? ''}{channel.countryName && channel.languageNames ? ', ' : ''}{channel.languageNames ?? ''}
      </p>
    </div>
  );
}
