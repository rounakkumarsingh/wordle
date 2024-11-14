export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    statsUsingPrivate: boolean;
    createdAt: string;
    games: string[];
}
