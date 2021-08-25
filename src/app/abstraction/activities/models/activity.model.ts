export interface Activity {
    id?: number;
    name: string;
    icon: string;
    color: ActivityColor;
    duration: number;
    frequency: number;
    dayPreference?: string[];
    timePreference?: string[];
    concreteTime?: string;
    selected?: boolean;
}

export interface ActivityColor {
    primaryColor: string;
    secondaryColor: string;
    isLight: boolean;
};

export interface ActivityBinding {
  id?: number;
  name: string;
  userId: number;
  icon: string;
  secondaryColor: string;
  duration: number;
  frequency: number;
  dayPreference?: string[];
  timePreference?: string[];
  concreteTimeHour?: number;
  concreteTimeMinute?: number;
}
