import { createFileRoute, Link } from "@tanstack/react-router";
import { ChartArea } from "lucide-react";
import { noAuthRequiredMiddleware } from "@/auth/middleware";
import { SignInCard } from "@/components/cards/sign-in";
import { FieldDescription } from "@/components/ui/field";

export const Route = createFileRoute("/sign-in")({
	component: RouteComponent,
	server: {
		middleware: [noAuthRequiredMiddleware],
	},
});

function RouteComponent() {
	return (
		<main className="flex grow flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex items-center gap-2 self-center font-medium">
					<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<ChartArea className="size-4" />
					</div>
					ServerStats
				</div>
				<SignInCard />
				<FieldDescription className="px-6 text-center">
					By signing in, you agree to our{" "}
					<Link to="/legal/terms-of-service">Terms of Service</Link> and{" "}
					<Link to="/legal/privacy-policy">Privacy Policy</Link>.
				</FieldDescription>
			</div>
		</main>
	);
}
