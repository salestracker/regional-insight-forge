import { 
  users, 
  businessValidations,
  type User, 
  type InsertUser,
  type BusinessValidation,
  type InsertBusinessValidation
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createBusinessValidation(validation: InsertBusinessValidation): Promise<BusinessValidation>;
  getBusinessValidation(id: number): Promise<BusinessValidation | undefined>;
  getAllBusinessValidations(): Promise<BusinessValidation[]>;
  updateBusinessValidation(id: number, updates: Partial<BusinessValidation>): Promise<BusinessValidation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businessValidations: Map<number, BusinessValidation>;
  private currentUserId: number;
  private currentValidationId: number;

  constructor() {
    this.users = new Map();
    this.businessValidations = new Map();
    this.currentUserId = 1;
    this.currentValidationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBusinessValidation(insertValidation: InsertBusinessValidation): Promise<BusinessValidation> {
    const id = this.currentValidationId++;
    const validation: BusinessValidation = { 
      ...insertValidation, 
      id,
      createdAt: new Date()
    };
    this.businessValidations.set(id, validation);
    return validation;
  }

  async updateBusinessValidation(id: number, updates: Partial<BusinessValidation>): Promise<BusinessValidation | undefined> {
    const existing = this.businessValidations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.businessValidations.set(id, updated);
    return updated;
  }

  async getBusinessValidation(id: number): Promise<BusinessValidation | undefined> {
    return this.businessValidations.get(id);
  }

  async getAllBusinessValidations(): Promise<BusinessValidation[]> {
    return Array.from(this.businessValidations.values());
  }
}

export const storage = new MemStorage();
