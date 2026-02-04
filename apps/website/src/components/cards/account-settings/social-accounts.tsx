import { Link } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const socialProviders = [
	{
		id: "google",
		name: "Google",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="size-5"
			>
				<title>Google</title>
				<path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
			</svg>
		),
	},
	{
		id: "github",
		name: "GitHub",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="size-5"
			>
				<title>GitHub</title>
				<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
			</svg>
		),
	},
];

type Account = {
	id: string;
	provider: string;
};

type Provider = (typeof socialProviders)[number];

export function SocialAccountsCard() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

	const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
	const [providerToDisconnect, setProviderToDisconnect] =
		useState<Provider | null>(null);

	const fetchAccounts = useCallback(async () => {
		const result = await authClient.listAccounts();
		if (result.data) {
			setAccounts(
				result.data.map((account) => ({
					id: account.id,
					provider: account.providerId,
				}))
			);
		}
	}, []);

	useEffect(() => {
		fetchAccounts();
	}, [fetchAccounts]);

	const getLinkedAccount = (providerId: string) => {
		return accounts.find((account) => account.provider === providerId);
	};

	const handleConnect = async (providerId: string) => {
		setLoadingProvider(providerId);
		try {
			await authClient.linkSocial({
				provider: providerId,
				callbackURL: window.location.href,
			});
		} catch (error) {
			toast.error(`Failed to connect ${providerId}. Please try again.`);
			console.error("Social link failed:", error);
			setLoadingProvider(null);
		}
	};

	const handleDisconnect = async () => {
		if (!providerToDisconnect) return;

		setLoadingProvider(providerToDisconnect.id);
		try {
			await authClient.unlinkAccount({
				providerId: providerToDisconnect.id,
				fetchOptions: {
					onSuccess() {
						toast.success("Account disconnected successfully!");
						setDisconnectDialogOpen(false);
						setProviderToDisconnect(null);
						fetchAccounts();
					},
					onError(context) {
						toast.error("Failed to disconnect account. Please try again.");
						console.error("Social unlink failed:", context.error.message);
					},
				},
			});
		} finally {
			setLoadingProvider(null);
		}
	};

	return (
		<>
			<Card id="social">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Link className="size-5" />
						Social Accounts
					</CardTitle>
					<CardDescription>
						Connect your social accounts for easier sign-in.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{socialProviders.map((provider) => {
						const linkedAccount = getLinkedAccount(provider.id);
						const isConnected = !!linkedAccount;
						const isLoading = loadingProvider === provider.id;

						return (
							<div
								key={provider.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div className="flex items-center gap-3">
									{provider.icon}
									<p className="font-medium">{provider.name}</p>
								</div>
								<Button
									variant={isConnected ? "outline" : "default"}
									size="sm"
									disabled={isLoading}
									onClick={() => {
										if (isConnected) {
											setProviderToDisconnect(provider);
											setDisconnectDialogOpen(true);
										} else {
											handleConnect(provider.id);
										}
									}}
								>
									{isLoading
										? isConnected
											? "Disconnecting..."
											: "Connecting..."
										: isConnected
											? "Disconnect"
											: "Connect"}
								</Button>
							</div>
						);
					})}
				</CardContent>
			</Card>

			<AlertDialog
				open={disconnectDialogOpen}
				onOpenChange={setDisconnectDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disconnect Account</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to disconnect your{" "}
							<span className="font-medium">{providerToDisconnect?.name}</span>{" "}
							account? You won't be able to use it to sign in anymore.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setDisconnectDialogOpen(false);
								setProviderToDisconnect(null);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleDisconnect}
							disabled={loadingProvider === providerToDisconnect?.id}
						>
							{loadingProvider === providerToDisconnect?.id
								? "Disconnecting..."
								: "Disconnect"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
