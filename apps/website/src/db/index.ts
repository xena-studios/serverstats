import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";

export const database = drizzle(env.DATABASE_URL);
