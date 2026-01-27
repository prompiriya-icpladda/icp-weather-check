import { Megaphone, FileText } from "lucide-react";

interface AnnouncementSlideProps {
  title: string;
  content: string;
  fileUrl?: string;
  fileType?: "image" | "pdf";
}

export const AnnouncementSlide = ({ title, content, fileUrl, fileType }: AnnouncementSlideProps) => {
  // If there's a file, show file-based announcement
  if (fileUrl) {
    if (fileType === "pdf") {
      return (
        <div className="h-full w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <div className="flex-1 p-4">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full rounded-lg border border-border shadow-lg"
              title={title}
            />
          </div>
        </div>
      );
    }

    // Image display
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
        <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center">
            {title}
          </h1>
          <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
            <img
              src={fileUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
          {content && (
            <div className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl">
              {content}
            </div>
          )}
        </div>
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
