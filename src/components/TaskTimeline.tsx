import { CalendarDays, Clock } from "lucide-react";
import type { ExtractedTask } from "@/types/task";

interface TaskTimelineProps {
  tasks: ExtractedTask[];
}

const urgencyDot = {
  low: "bg-[hsl(var(--urgency-low))]",
  medium: "bg-[hsl(var(--urgency-medium))]",
  high: "bg-[hsl(var(--urgency-high))]",
};

const TaskTimeline = ({ tasks }: TaskTimelineProps) => {
  const sorted = [...tasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-2.5 top-1 bottom-1 w-px bg-border" />
        <div className="space-y-4">
          {sorted.map((task, i) => (
            <div
              key={task.id}
              className="relative flex items-start gap-3 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div
                className={`absolute -left-[14px] top-1.5 h-3 w-3 rounded-full ring-2 ring-card ${urgencyDot[task.urgency]}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">{task.deadline}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {task.estimatedMinutes}m
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTimeline;
