import YouTube from 'react-youtube';
import { Music } from 'lucide-react';

interface MediaPlayerProps {
  type: 'podcast' | 'video';
  url: string;
  title: string;
  thumbnail?: string;
}

export default function MediaPlayer({ type, url, title }: MediaPlayerProps) {
  if (type === 'video') {
    // Extract YouTube video ID from URL
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    if (!videoId) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Invalid YouTube URL</p>
        </div>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden shadow-lg">
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '480',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          className="w-full aspect-video"
        />
      </div>
    );
  }

  // Podcast player (Spotify embed)
  if (type === 'podcast') {
    // Check if it's a Spotify URL
    if (url.includes('spotify.com')) {
      // Convert Spotify URL to embed format
      const embedUrl = url.replace('/episode/', '/embed/episode/').replace('/show/', '/embed/show/');

      return (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
          <iframe
            src={embedUrl}
            width="100%"
            height="232"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      );
    }

    // Generic audio player for other sources
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
            <Music className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm opacity-90">Podcast Episode</p>
          </div>
        </div>
        <audio controls className="w-full">
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
}
