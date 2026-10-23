import * as z from "zod";
import { Role } from "../../generated/prisma/enums.js";

export const registerSchema = z.object({
    name: z.string("Name is required."),
    email: z.email("Please enter a valid email address"),
    password: z.string("Password is required").min(6, "Password should be at least 6 characters long."),
    confirmPassword: z.string("Confirm password is required").min(6, "Confirm password should be at least 6 characters long."),
    role: z.enum([Role.COOK, Role.MANAGER, Role.OWNER, Role.WAITER])
});

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z.string("Password is required.").min(6, "Password should be at least 6 characters long.")
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

