import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle Tables (for template compliance, actual data stored in Firebase)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ['user', 'admin'] }).notNull().default('user'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const licenses = pgTable("licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  type: text("type", { enum: ['Small Business', 'Enterprise', 'Trial', 'None'] }).notNull(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  userEmail: text("user_email").notNull(),
  rating: integer("rating").notNull(), // 1-5 as integer
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLicenseSchema = createInsertSchema(licenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Select Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type License = typeof licenses.$inferSelect;
export type InsertLicense = z.infer<typeof insertLicenseSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Additional Zod schemas for Firebase (with proper number types)
export const firebaseUserProfileSchema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  createdAt: z.string(),
});

export const firebaseLicenseSchema = z.object({
  userId: z.string(),
  type: z.enum(['Small Business', 'Enterprise', 'Trial', 'None']),
  expiryDate: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const firebaseReviewSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
  createdAt: z.string(),
});

export type FirebaseUserProfile = z.infer<typeof firebaseUserProfileSchema>;
export type FirebaseLicense = z.infer<typeof firebaseLicenseSchema>;
export type FirebaseReview = z.infer<typeof firebaseReviewSchema>;

export const firebaseContactMessageSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  createdAt: z.string(),
});

export type FirebaseContactMessage = z.infer<typeof firebaseContactMessageSchema>;

// License type enum
export const licenseTypeSchema = z.enum(['Small Business', 'Enterprise', 'Trial', 'None']);
export type LicenseType = z.infer<typeof licenseTypeSchema>;

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordChange = z.infer<typeof passwordChangeSchema>;

// Auth Schemas
export const signUpSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policies and Terms of Service",
  }),
});

export const signInSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
