import { useState } from "react";
import { Check, Clock, ChevronDown, ChevronUp, Play, CalendarDays } from "lucide-react";
import type { ExtractedTask } from "@/types/task";

interface TaskCardProps {
  task: ExtractedTask;
  index: number;
  onStart: (id: string) => void;
}

const urgencyConfig = {
  low: { label: "Low", class: "urgency-low" },
  medium: { label: "Medium", class: "urgency-medium" },
  high: { label: "High", class: "urgency-high" },
};

const TaskCard = ({ task, index, onStart }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const urgency = urgencyConfig[task.urgency];

  const toggleStep = (stepIndex: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepIndex) ? next.delete(stepIndex) : next.add(stepIndex);
      return next;
    });
  };

  const progress = task.steps.length > 0 ? (checkedSteps.size / task.steps.length) * 100 : 0;

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${urgency.class}`}>
              {urgency.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              ~{task.estimatedMinutes} min
            </span>
          </div>
          <h3 className="font-semibold text-foreground leading-snug">{task.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </div>
        {!task.started ? (
          <button
            onClick={() => onStart(task.id)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="h-3.5 w-3.5" />
            Start
          </button>
        ) : (
          <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-accent">
            <Check className="h-4 w-4" /> In Progress
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>Due: {task.deadline}</span>
      </div>

      {/* Progress bar */}
      {task.started && (
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Expandable steps */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {task.steps.length} steps
      </button>

      {expanded && (
        <ul className="mt-3 space-y-2 animate-fade-in">
          {task.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <button
                onClick={() => toggleStep(i)}
                className={`mt-0.5 h-4.5 w-4.5 shrink-0 rounded border transition-colors flex items-center justify-center
                  ${checkedSteps.has(i) ? "bg-accent border-accent" : "border-border hover:border-primary"}`}
              >
                {checkedSteps.has(i) && <Check className="h-3 w-3 text-accent-foreground" />}
              </button>
              <span
                className={`text-sm leading-snug transition-colors ${
                  checkedSteps.has(i) ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {step}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskCard;
