export enum Roles {
    ADMIN = "admin",
    USER = "user"
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Roles;
    createdAt: string;
    updatedAt: string;
}