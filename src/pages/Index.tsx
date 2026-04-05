import { useState, useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";
import UploadZone from "@/components/UploadZone";
import TaskCard from "@/components/TaskCard";
import TaskTimeline from "@/components/TaskTimeline";
import Paywall from "@/components/Paywall";
import type { ExtractedTask } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";

const FREE_UPLOAD_LIMIT = 3;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:... prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Index = () => {
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [uploadCount, setUploadCount] = useState(() => {
    return parseInt(localStorage.getItem("pma_upload_count") || "0", 10);
  });
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("pma_unlocked") === "true";
  });

  // Check for payment success via URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      localStorage.setItem("pma_unlocked", "true");
      setIsUnlocked(true);
      toast.success("Payment successful! Unlimited access unlocked.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const isPaywalled = !isUnlocked && uploadCount >= FREE_UPLOAD_LIMIT;

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    try {
      const imageBase64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke("extract-tasks", {
        body: { imageBase64 },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        setIsProcessing(false);
        return;
      }

      const extractedTasks: ExtractedTask[] = (data.tasks || []).map(
        (t: any, i: number) => ({
          id: String(i + 1),
          title: t.title,
          description: t.description,
          deadline: t.deadline,
          urgency: t.urgency,
          estimatedMinutes: t.estimatedMinutes,
          steps: t.steps,
          started: false,
        })
      );

      setTasks(extractedTasks);
      setHasUploaded(true);
      const newCount = uploadCount + 1;
      setUploadCount(newCount);
      localStorage.setItem("pma_upload_count", String(newCount));
      toast.success(`Extracted ${extractedTasks.length} tasks from your assignment!`);
    } catch (err: any) {
      console.error("Extraction error:", err);
      toast.error(err?.message || "Failed to analyze the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStart = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, started: true } : t))
    );
  };

  const handleReset = () => {
    setTasks([]);
    setHasUploaded(false);
  };

  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const highCount = tasks.filter((t) => t.urgency === "high").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary p-1.5">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">PlanMyAssignment</span>
          </div>
          {hasUploaded && (
            <button
              onClick={handleReset}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              + New Upload
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {isPaywalled ? (
          <Paywall />
        ) : isUnlocked && !hasUploaded ? (
          <div className="animate-fade-in">
            <Paywall onUnlocked />
            <div className="mt-8 max-w-2xl mx-auto">
              <UploadZone onFileSelected={handleFileSelected} isProcessing={isProcessing} />
            </div>
          </div>
        ) : !hasUploaded ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Study Planner
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Turn assignments into
                <br />
                <span className="text-primary">actionable plans</span>
              </h1>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Upload a screenshot of your assignment and get a step-by-step checklist with deadlines and time estimates.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <UploadZone onFileSelected={handleFileSelected} isProcessing={isProcessing} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <h2 className="text-xl font-bold text-foreground">
                {tasks.length} tasks extracted
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">⏱ {totalMinutes} min total</span>
                {highCount > 0 && (
                  <span className="urgency-high text-xs font-semibold px-2 py-0.5 rounded-full">
                    {highCount} urgent
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                {tasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} onStart={handleStart} />
                ))}
              </div>
              <div className="lg:sticky lg:top-24 lg:self-start">
                <TaskTimeline tasks={tasks} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
