export type Urgency = "low" | "medium" | "high";

export interface ExtractedTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  urgency: Urgency;
  estimatedMinutes: number;
  steps: string[];
  started: boolean;
}
