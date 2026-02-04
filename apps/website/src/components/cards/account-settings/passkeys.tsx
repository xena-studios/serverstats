import { useForm } from "@tanstack/react-form-start";
import { Fingerprint, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Passkey = {
	id: string;
	name?: string;
	createdAt: Date;
};

export function PasskeysCard() {
	const [passkeys, setPasskeys] = useState<Passkey[]>([]);
	const [isAdding, setIsAdding] = useState(false);
	const [removingId, setRemovingId] = useState<string | null>(null);

	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [passkeyToDelete, setPasskeyToDelete] = useState<Passkey | null>(null);

	const fetchPasskeys = useCallback(async () => {
		const result = await authClient.passkey.listUserPasskeys();
		if (result.data) {
			setPasskeys(result.data);
		}
	}, []);

	useEffect(() => {
		fetchPasskeys();
	}, [fetchPasskeys]);

	const form = useForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, "Please enter a name for your passkey."),
			}),
		},
		onSubmit: async ({ value }: { value: { name: string } }) => {
			setIsAdding(true);
			try {
				await authClient.passkey.addPasskey({
					name: value.name.trim(),
					fetchOptions: {
						onSuccess() {
							toast.success("Passkey added successfully!");
							setAddDialogOpen(false);
							form.reset();
							fetchPasskeys();
						},
						onError(context) {
							toast.error("Failed to add passkey. Please try again.");
							console.error("Passkey add failed:", context.error.message);
						},
					},
				});
			} catch (error) {
				toast.error("Failed to add passkey. Please try again.");
				console.error("Passkey add failed:", error);
			} finally {
				setIsAdding(false);
			}
		},
	});

	const handleRemovePasskey = async () => {
		if (!passkeyToDelete) return;

		setRemovingId(passkeyToDelete.id);
		try {
			await authClient.passkey.deletePasskey({
				id: passkeyToDelete.id,
				fetchOptions: {
					onSuccess() {
						toast.success("Passkey removed successfully!");
						setDeleteDialogOpen(false);
						setPasskeyToDelete(null);
						fetchPasskeys();
					},
					onError(context) {
						toast.error("Failed to remove passkey. Please try again.");
						console.error("Passkey remove failed:", context.error.message);
					},
				},
			});
		} finally {
			setRemovingId(null);
		}
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(date));
	};

	return (
		<>
			<Card id="passkeys">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Fingerprint className="size-5" />
						Passkeys
					</CardTitle>
					<CardDescription>
						Add passkeys for secure, passwordless sign-in using biometrics or
						security keys.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{passkeys.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
							<div className="flex size-12 items-center justify-center rounded-full bg-muted">
								<Fingerprint className="size-6 text-muted-foreground" />
							</div>
							<h3 className="mt-4 font-medium">No passkeys added</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Add a passkey to enable passwordless sign-in.
							</p>
						</div>
					) : (
						passkeys.map((passkey) => (
							<div
								key={passkey.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-muted">
										<Fingerprint className="size-5" />
									</div>
									<div>
										<p className="font-medium">{passkey.name || "Passkey"}</p>
										<p className="text-muted-foreground text-sm">
											Added {formatDate(passkey.createdAt)}
										</p>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:bg-destructive/10 hover:text-destructive"
									onClick={() => {
										setPasskeyToDelete(passkey);
										setDeleteDialogOpen(true);
									}}
								>
									Remove
								</Button>
							</div>
						))
					)}
				</CardContent>
				<CardFooter className="border-t pt-6">
					<Button variant="outline" onClick={() => setAddDialogOpen(true)}>
						<Plus className="size-4" />
						Add Passkey
					</Button>
				</CardFooter>
			</Card>

			<Dialog
				open={addDialogOpen}
				onOpenChange={(open) => {
					setAddDialogOpen(open);
					if (!open) form.reset();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Passkey</DialogTitle>
						<DialogDescription>
							Give your passkey a name to help you identify it later.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<form.Field name="name">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Passkey Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g. MacBook Pro Touch ID"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<DialogFooter className="mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setAddDialogOpen(false);
									form.reset();
								}}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isAdding}>
								{isAdding ? "Adding..." : "Continue"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Passkey</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove{" "}
							<span className="font-medium">
								{passkeyToDelete?.name || "this passkey"}
							</span>
							? You won't be able to use it to sign in anymore.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setDeleteDialogOpen(false);
								setPasskeyToDelete(null);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleRemovePasskey}
							disabled={removingId === passkeyToDelete?.id}
						>
							{removingId === passkeyToDelete?.id ? "Removing..." : "Remove"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
