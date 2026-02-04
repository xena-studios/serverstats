import { useForm } from "@tanstack/react-form-start";
import { Mail } from "lucide-react";
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

export function EmailCard() {
	const session = authClient.useSession();
	const originalEmail = session.data?.user?.email || "";

	const form = useForm({
		defaultValues: {
			email: originalEmail,
		},
		validators: {
			onSubmit: z.object({
				email: z.string().email("Please enter a valid email address."),
			}),
		},
		onSubmit: async ({ value }: { value: { email: string } }) => {
			if (value.email === originalEmail) {
				toast.info(
					"You're already using that email! Please enter a different email."
				);
				return;
			}

			await authClient.changeEmail({
				newEmail: value.email,
				fetchOptions: {
					onSuccess() {
						toast.success("Verification email sent! Please check your inbox.");
					},
					onError(context) {
						toast.error("Unable to update email! Please try again.");
						console.error("Email update failed:", context.error.message);
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
			<Card id="email">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Mail className="size-5" />
						Email Address
					</CardTitle>
					<CardDescription>
						Manage your email address for sign-in and account verification.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form.Field name="email">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="john@example.com"
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
								{isSubmitting ? "Updating..." : "Update Email"}
							</Button>
						)}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</form>
	);
}
