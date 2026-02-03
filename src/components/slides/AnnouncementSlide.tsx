import { Megaphone, FileText } from "lucide-react";

interface AnnouncementSlideProps {
  title: string;
  content: string;
  fileUrl?: string;
  fileType?: "image" | "pdf" | "video";
}

export const AnnouncementSlide = ({ title, content, fileUrl, fileType }: AnnouncementSlideProps) => {
  // If there's a file, show file-based announcement
  if (fileUrl) {
    if (fileType === "pdf") {
      return (
        <div className="h-full w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          {/* Compact header for PDF */}
          <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-full bg-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground truncate">
              {title}
            </h1>
          </div>
          {/* Maximize PDF viewer space */}
          <div className="flex-1 p-2 min-h-0">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full rounded-lg border border-border shadow-lg"
              title={title}
            />
          </div>
        </div>
      );
    }

    // Image display - maximize image size
    return (
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Compact header for image */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center justify-center shrink-0">
          <h1 className="text-xl font-bold text-foreground text-center truncate">
            {title}
          </h1>
        </div>
        {/* Maximize image space */}
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <img
            src={fileUrl}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
        {content && (
          <div className="bg-card/60 backdrop-blur-sm border-t border-border px-4 py-2 shrink-0">
            <p className="text-base text-muted-foreground text-center truncate">
              {content}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Text-only announcement (original behavior)
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
