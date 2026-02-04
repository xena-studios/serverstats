import { createFileRoute } from "@tanstack/react-router";
import { authRequiredMiddleware } from "@/auth/middleware";

export const Route = createFileRoute("/_dashboard/settings")({
	component: RouteComponent,
	server: {
		middleware: [authRequiredMiddleware],
	},
});

function RouteComponent() {
	return (
		<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="py-4">
				<h1 className="font-bold text-3xl tracking-tight">Settings</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your organization settings and preferences.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2"></div>
		</main>
	);
}
