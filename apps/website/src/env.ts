import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	// Server Variables
	server: {
		DATABASE_URL: z.url(),
		AUTH_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
		RESEND_API_KEY: z.string(),
		RESEND_FROM_EMAIL: z.string(),
	},

	// Client Variables
	clientPrefix: "VITE_",
	client: {
		VITE_APP_URL: z.string(),
	},

	// Configuration Options
	runtimeEnv: {
		...process.env,
		...import.meta.env,
	},
	emptyStringAsUndefined: true,
});
