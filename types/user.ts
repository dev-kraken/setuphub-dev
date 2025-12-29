import { type User } from "better-auth";

export interface CurrentUser extends User {
    username: string;
}