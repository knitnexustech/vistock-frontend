import * as z from "zod";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  apiKey: z.string().min(1, "API Key is required"),
  apiSecret: z.string().min(1, "API Secret is required"),
  erpDomain: z.string().min(1, "ERP Domain is required"),
});

export default createUserSchema;
