import { useForm } from "@tanstack/react-form-start";
import { User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NameCard() {
	const session = authClient.useSession();
	const originalName = session.data?.user?.name || "";

	const form = useForm({
		defaultValues: {
			name: originalName,
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(3, "Name must be at least 3 characters long."),
			}),
		},
		onSubmit: async ({ value }: { value: { name: string } }) => {
			if (value.name === originalName) {
				toast.info(
					"You're already using that name! Please enter a different name."
				);
				return;
			}

			await authClient.updateUser({
				name: value.name,
				fetchOptions: {
					onSuccess() {
						toast.success("Name updated successfully!");
					},
					onError(context) {
						toast.error("Unable to update name! Please try again.");
						console.error("Name update failed:", context.error.message);
					},
				},
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="size-5" />
						Name
					</CardTitle>
					<CardDescription>
						Update your display name as it appears across your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form.Field name="name">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="John Doe"
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</CardContent>
				<CardFooter className="border-t pt-6">
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Updating..." : "Update Name"}
							</Button>
						)}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</form>
	);
}
