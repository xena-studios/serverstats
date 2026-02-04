import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
	component: RouteComponent,
});

export function RouteComponent() {
	return (
		<main className="flex flex-grow items-center justify-center">
			<h1 className="font-bold text-2xl">Home</h1>
		</main>
	);
}
