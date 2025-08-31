import { Profile } from "./profile.types";
import { Vote } from "./votes.types";

export type Payment_Status = 'PENDING' | 'COMPLETED' | 'FAILED';
export interface Payment {
    id: string;
    payerId: string;
    payer: Profile;
    amount: number;
    status: Payment_Status;
    votes: Vote[];
    stripeSessionId: string;
    createdAt: string;
    updatedAt: string;
}