import { User } from "./user.model";

export interface MusicRoom {
    id: string;
    name: string;
    description: string;
    created_by: string;
    user: User;
}