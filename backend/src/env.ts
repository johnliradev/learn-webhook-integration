import { z } from "zod";

const envSchema = z.object({
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "STRIPE_PUBLISHABLE_KEY is required"),
  PORT: z.string().default("3000"),
});

export type Env = z.infer<typeof envSchema>;
function parseEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = parseEnv();
