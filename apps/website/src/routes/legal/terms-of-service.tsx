import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms-of-service")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-grow items-center justify-center">
			<h1 className="font-bold text-2xl">Terms of Service</h1>
		</main>
	);
}
