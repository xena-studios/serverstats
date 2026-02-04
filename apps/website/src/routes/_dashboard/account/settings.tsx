import { createFileRoute } from "@tanstack/react-router";
import { authRequiredMiddleware } from "@/auth/middleware";
import { DeleteAccountCard } from "@/components/cards/account-settings/delete-account";
import { DevicesCard } from "@/components/cards/account-settings/devices";
import { EmailCard } from "@/components/cards/account-settings/email";
import { NameCard } from "@/components/cards/account-settings/name";
import { PasskeysCard } from "@/components/cards/account-settings/passkeys";
import { SocialAccountsCard } from "@/components/cards/account-settings/social-accounts";

export const Route = createFileRoute("/_dashboard/account/settings")({
	component: RouteComponent,
	server: {
		middleware: [authRequiredMiddleware],
	},
});

function RouteComponent() {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="py-4">
				<h1 className="font-bold text-3xl tracking-tight">Account Settings</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2">
				<NameCard />
				<EmailCard />
				<SocialAccountsCard />
				<PasskeysCard />
				<DevicesCard />
				<DeleteAccountCard />
			</div>
		</main>
	);
}
