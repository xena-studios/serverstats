import { Trash2 } from "lucide-react";
import { useState } from "react";
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
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function DeleteAccountCard() {
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDeleteAccount = async () => {
		await authClient.deleteUser({
			fetchOptions: {
				onSuccess() {
					toast.success(
						"An email has been sent to your address to confirm the deletion of your account. Please check your inbox."
					);
					setDialogOpen(false);
				},
				onError(context) {
					toast.error("Unable to delete your account! Please try again.");
					console.error("Account deletion failed:", context.error.message);
				},
			},
		});
	};

	return (
		<>
			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<Trash2 className="size-5" />
						Delete Account
					</CardTitle>
					<CardDescription>
						Permanently delete your account and all associated data. This action
						cannot be undone.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
						<p className="text-muted-foreground text-sm">
							Once you delete your account, all of your data will be permanently
							removed. This includes your profile, settings, and any content
							you've created. Please be certain before proceeding.
						</p>
					</div>
				</CardContent>
				<CardFooter className="border-t pt-6">
					<Button variant="destructive" onClick={() => setDialogOpen(true)}>
						Delete Account
					</Button>
				</CardFooter>
			</Card>

			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove all of your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleDeleteAccount}
						>
							Delete Account
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
