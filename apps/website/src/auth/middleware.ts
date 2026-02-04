import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/auth";

export const authRequiredMiddleware = createMiddleware().server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		if (!session) {
			throw redirect({ to: "/sign-in" });
		}

		return await next();
	}
);

export const noAuthRequiredMiddleware = createMiddleware().server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		if (session) {
			throw redirect({ to: "/" });
		}

		return await next();
	}
);
