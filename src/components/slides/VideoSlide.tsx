import { useState, useRef, useEffect } from "react";
import { Loader2, Volume2, VolumeX } from "lucide-react";

interface VideoSlideProps {
  url: string;
  title: string;
}

export const VideoSlide = ({ url, title }: VideoSlideProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [url]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="h-full w-full relative bg-black flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      <video
        ref={videoRef}
        src={url}
        title={title}
        className="h-full w-full object-contain"
        onLoadedData={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />

      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-20"
        aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};
