import { User } from "@shared/schema";

declare module "express-session" {
  export interface SessionData {
    user: User;
  }
}