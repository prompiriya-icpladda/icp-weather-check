import { Slide } from "@/hooks/useSlides";
import { WeatherSlide } from "./slides/WeatherSlide";
import { IframeSlide } from "./slides/IframeSlide";
import { AnnouncementSlide } from "./slides/AnnouncementSlide";

interface SlideRendererProps {
  slide: Slide;
}

export const SlideRenderer = ({ slide }: SlideRendererProps) => {
  switch (slide.type) {
    case "weather":
      return <WeatherSlide />;
    case "iframe":
      return <IframeSlide url={slide.url || ""} title={slide.title} />;
    case "announcement":
      return (
        <AnnouncementSlide 
          title={slide.title} 
          content={slide.content || ""} 
          fileUrl={slide.file_url}
          fileType={slide.file_type}
        />
      );
    default:
      return null;
  }
};
