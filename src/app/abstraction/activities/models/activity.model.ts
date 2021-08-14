export interface Activity {
    name: string;
    icon: string;
    duration: number;
    frequency: number;
    dayPreference?: string[];
    timePreference?: string[];
    concreteTime?: {};
    selected?: boolean;
}
