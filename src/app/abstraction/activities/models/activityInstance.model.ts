import { ActivityColor } from "./activity.model";

export interface ActivityInstance {
    id?: number;
    start: Date;
    end?: Date;
    title: string;
    color?: ActivityColor;
}