import { Activity } from "./activity.model";

export interface Plan {
  selectedActivities: Activity[];
  userId: number;
  start: Date;
}

export interface PlanBinding {
  activities: Activity[];
  userId: number;
  start: string;
  end: string;
}
