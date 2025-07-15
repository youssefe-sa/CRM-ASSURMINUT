import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { User, LoginData } from "@shared/schema";

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async authenticate(loginData: LoginData): Promise<User | null> {
    const user = await storage.getUserByUsername(loginData.username);
    
    if (!user || !user.actif) {
      return null;
    }

    const isValid = await this.verifyPassword(loginData.password, user.password);
    
    if (!isValid) {
      return null;
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async createUser(userData: { username: string; email: string; password: string; nom: string; prenom: string; role?: string }): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
      role: userData.role || "agent",
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}

export const authService = new AuthService();
