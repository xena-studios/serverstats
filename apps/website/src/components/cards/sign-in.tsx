import { useForm } from "@tanstack/react-form-start";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignInCard() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState("");

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Please enter a valid email address."),
			}),
		},
		onSubmit: async ({ value }: { value: { email: string } }) => {
			await authClient.signIn.magicLink({
				email: value.email,
				callbackURL: "/",
				fetchOptions: {
					onRequest() {
						setIsProcessing(true);
					},
					onResponse() {
						setIsProcessing(false);
					},
					onSuccess() {
						setSubmittedEmail(value.email);
						setEmailSent(true);
					},
					onError(context) {
						toast.error("Unable to sign in with email! Please try again.");
						console.error(
							"Email Authentication failed:",
							context.error.message
						);
					},
				},
			});
		},
	});

	function handleBack() {
		setEmailSent(false);
		setSubmittedEmail("");
		form.reset();
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">
					{emailSent ? "Check Your Email" : "Welcome"}
				</CardTitle>
				<CardDescription>
					{emailSent
						? "We've sent a sign-in link to your email address"
						: "Sign in with Google, GitHub, or Passkey"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{emailSent ? (
					<div className="grid gap-4">
						<p className="text-center text-muted-foreground text-sm">
							We've sent a sign-in link to{" "}
							<span className="font-medium text-foreground">
								{submittedEmail}
							</span>
							. Click the link in the email to continue.
						</p>
						<Button variant="outline" onClick={handleBack}>
							Back to Sign in
						</Button>
					</div>
				) : (
					<FieldGroup>
						<Field>
							<Button
								variant="outline"
								type="button"
								disabled={isProcessing}
								onClick={async () => {
									await authClient.signIn.social({
										provider: "google",
										callbackURL: "/",
										fetchOptions: {
											onRequest() {
												setIsProcessing(true);
											},
											onResponse() {
												setIsProcessing(false);
											},
											onError(context) {
												toast.error(
													"Unable to sign in with Google! Please try again."
												);
												console.error(
													"Google Authentication failed:",
													context.error.message
												);
											},
										},
									});
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<title>Google</title>
									<path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
								</svg>
								Sign in with Google
							</Button>
							<Button
								variant="outline"
								type="button"
								disabled={isProcessing}
								onClick={async () => {
									await authClient.signIn.social({
										provider: "github",
										callbackURL: "/",
										fetchOptions: {
											onRequest() {
												setIsProcessing(true);
											},
											onResponse() {
												setIsProcessing(false);
											},
											onError(context) {
												toast.error(
													"Unable to sign in with GitHub! Please try again."
												);
												console.error(
													"GitHub Authentication failed:",
													context.error.message
												);
											},
										},
									});
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<title>GitHub</title>
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
								</svg>
								Sign in with GitHub
							</Button>
							<Button
								variant="outline"
								type="button"
								disabled={isProcessing}
								onClick={async () => {
									await authClient.signIn.passkey({
										fetchOptions: {
											onRequest() {
												setIsProcessing(true);
											},
											onResponse() {
												setIsProcessing(false);
											},
											onSuccess(_context) {
												window.location.href = "/";
											},
											onError(context) {
												toast.error(
													"Unable to sign in with Passkey! Please try again."
												);
												console.error(
													"Passkey Authentication failed:",
													context.error.message
												);
											},
										},
									});
								}}
							>
								<KeyRound />
								Sign in with Passkey
							</Button>
						</Field>
						<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
							Or continue with
						</FieldSeparator>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
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
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={isProcessing}
												aria-invalid={isInvalid}
												placeholder="john@example.com"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
											<Button type="submit" disabled={isProcessing}>
												{form.state.isSubmitting && field.state.meta.isValid
													? "Sending..."
													: "Sign in with Email"}
											</Button>
										</Field>
									);
								}}
							</form.Field>
						</form>
					</FieldGroup>
				)}
			</CardContent>
		</Card>
	);
}
