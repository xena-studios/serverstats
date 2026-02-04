import { passkeyClient } from "@better-auth/passkey/client";
import {
	magicLinkClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

export const authClient = createAuthClient({
	baseURL: env.VITE_APP_URL,
	plugins: [passkeyClient(), magicLinkClient(), organizationClient()],
});
