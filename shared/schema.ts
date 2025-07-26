import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const businessValidations = pgTable("business_validations", {
  id: serial("id").primaryKey(),
  businessIdea: text("business_idea").notNull(),
  targetRegion: text("target_region").notNull(),
  industry: text("industry").notNull(),
  targetAudience: text("target_audience").notNull(),
  budget: text("budget").notNull(),
  analysisResult: text("analysis_result"), // JSON string of the AI analysis
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBusinessValidationSchema = createInsertSchema(businessValidations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBusinessValidation = z.infer<typeof insertBusinessValidationSchema>;
export type BusinessValidation = typeof businessValidations.$inferSelect;
