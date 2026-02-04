import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/routes/home";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});
