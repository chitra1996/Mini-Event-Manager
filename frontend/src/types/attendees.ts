export interface Attendee {
    id: string;
    name: string;
    email: string;
    phone: string;
    age?: number;
    gender?: string;
    address?: string;
    emergencyContact?: string;
    dietaryRestrictions?: string;
    specialRequirements?: string;
}