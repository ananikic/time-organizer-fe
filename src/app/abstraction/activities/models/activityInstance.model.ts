import { ActivityColor } from "./activity.model";

export interface ActivityInstance {
    id?: number;
    start: string;
    end?: string;
    title: string;
    color?: ActivityColor;
}

export interface ActivityInstanceBinding {
  id?: number;
  title: string;
  userId: number;
  start: string;
  end?: string;
  secondaryColor: string;
}
