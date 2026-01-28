import { useState } from "react";
import { Loader2 } from "lucide-react";

interface IframeSlideProps {
  url: string;
  title: string;
}

export const IframeSlide = ({ url, title }: IframeSlideProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full w-full relative bg-background">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className="h-full w-full border-0"
        onLoad={() => setIsLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-popups"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
