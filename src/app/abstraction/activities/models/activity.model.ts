export interface Activity {
    id?: number;
    name: string;
    icon: string;
    color: ActivityColor;
    duration: number;
    frequency: number;
    dayPreference?: string[];
    timePreference?: string[];
    concreteTime?: { hour: number; minute: number; };
    selected?: boolean;
}

export interface ActivityColor {
    primary: string;
    secondary: string;
    isLight: boolean;
};
