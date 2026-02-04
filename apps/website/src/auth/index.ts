import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { magicLink, organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { ChangeEmailConfirmationEmail } from "@/components/emails/change-email-confirmation";
import { DeleteAccountVerificationEmail } from "@/components/emails/delete-account-verification";
import { EmailVerificationEmail } from "@/components/emails/email-verification";
import { MagicLinkEmail } from "@/components/emails/magic-link";
import { database } from "@/db";
import { authSchema } from "@/db/schema";
import { resend } from "@/email";
import { env } from "@/env";

export const auth = betterAuth({
	appName: "ServerStats",
	baseURL: env.VITE_APP_URL,
	secret: env.AUTH_SECRET,
	database: drizzleAdapter(database, {
		provider: "pg",
		schema: authSchema,
	}),
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: env.RESEND_FROM_EMAIL,
				to: user.email,
				subject: "ServerStats Email Verification",
				react: EmailVerificationEmail({ emailVerificationURL: url }),
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600, // 1 hour
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	plugins: [
		passkey({
			advanced: {
				webAuthnChallengeCookie: "passkey-challenge",
			},
		}),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await resend.emails.send({
					from: env.RESEND_FROM_EMAIL,
					to: email,
					subject: "ServerStats Sign in Link",
					react: MagicLinkEmail({ signInURL: url }),
				});
			},
		}),
		organization(),
		tanstackStartCookies(),
	],
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
				await resend.emails.send({
					from: env.RESEND_FROM_EMAIL,
					to: user.email,
					subject: "ServerStats Change Email Confirmation",
					react: ChangeEmailConfirmationEmail({
						changeEmailConfirmationURL: url,
						newEmail: newEmail,
					}),
				});
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				await resend.emails.send({
					from: env.RESEND_FROM_EMAIL,
					to: user.email,
					subject: "ServerStats Delete Account Verification",
					react: DeleteAccountVerificationEmail({
						deleteAccountVerificationURL: url,
					}),
				});
			},
		},
	},
	account: {
		encryptOAuthTokens: true,
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"],
			allowDifferentEmails: true,
			allowUnlinkingAll: true,
		},
	},
	advanced: {
		cookiePrefix: "auth",
	},
});
