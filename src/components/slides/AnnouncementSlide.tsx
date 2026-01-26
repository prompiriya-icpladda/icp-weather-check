import { Megaphone } from "lucide-react";

interface AnnouncementSlideProps {
  title: string;
  content: string;
}

export const AnnouncementSlide = ({ title, content }: AnnouncementSlideProps) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-primary/20">
            <Megaphone className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {title}
        </h1>
        
        <div className="text-xl md:text-2xl text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};
