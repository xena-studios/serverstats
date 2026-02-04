import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/privacy-policy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-grow items-center justify-center">
			<h1 className="font-bold text-2xl">Privacy Policy</h1>
		</main>
	);
}
