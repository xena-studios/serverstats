import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/overview")({
	component: RouteComponent,
});

export function RouteComponent() {
	return (
		<main className="flex flex-grow items-center justify-center">
			<h1 className="font-bold text-2xl">Overview</h1>
		</main>
	);
}
