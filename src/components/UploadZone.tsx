import { useCallback, useState } from "react";
import { Upload, Image, FileText } from "lucide-react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const UploadZone = ({ onFileSelected, isProcessing }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer
        ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/50"}
        ${isProcessing ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*,.pdf,application/pdf"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center gap-4">
        {isProcessing ? (
          <>
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-lg font-medium text-foreground">Analyzing your assignment...</p>
            <p className="text-sm text-muted-foreground">Extracting tasks, deadlines & requirements</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <Image className="h-6 w-6 text-accent" />
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drop your assignment screenshot here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Supports images of assignments, syllabi & instructions
              </p>
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Click or drag to upload
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
