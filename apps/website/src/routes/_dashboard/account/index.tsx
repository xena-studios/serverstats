import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Calendar,
	ExternalLink,
	Mail,
	Monitor,
	Settings,
	Shield,
} from "lucide-react";
import { authClient } from "@/auth/client";
import { authRequiredMiddleware } from "@/auth/middleware";
import { OrganizationsList } from "@/components/lists/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_dashboard/account/")({
	component: RouteComponent,
	server: {
		middleware: [authRequiredMiddleware],
	},
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	const user = session?.user;

	const formatJoinDate = (date: Date | string | undefined) => {
		if (!date) return "Unknown";
		return new Date(date).toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		});
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="py-4">
				<h1 className="font-bold text-3xl tracking-tight">Account Overview</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your account and organizations.
				</p>
			</div>
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<OrganizationsList />
				</div>
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
							<CardDescription>Your personal account details.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-4">
								<Avatar className="size-16">
									<AvatarImage
										src={user?.image ?? undefined}
										alt={user?.name}
									/>
									<AvatarFallback className="text-lg">
										{user?.name?.charAt(0) ?? "?"}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-semibold">{user?.name}</h3>
									<p className="text-muted-foreground text-sm">{user?.email}</p>
								</div>
							</div>
							<Separator />
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<Calendar className="size-4" />
								<span>Joined {formatJoinDate(user?.createdAt)}</span>
							</div>
							<Button
								variant="outline"
								className="w-full gap-2 bg-transparent"
								asChild
							>
								<Link to="/account/settings">
									<Settings className="size-4" />
									Account Settings
								</Link>
							</Button>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Quick Links</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Button
								variant="ghost"
								className="w-full justify-start gap-2"
								asChild
							>
								<Link to="/account/settings" hash="email">
									<Mail className="size-4" />
									Email Settings
									<ExternalLink className="ml-auto size-3" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								className="w-full justify-start gap-2"
								asChild
							>
								<Link to="/account/settings" hash="password">
									<Shield className="size-4" />
									Security Settings
									<ExternalLink className="ml-auto size-3" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								className="w-full justify-start gap-2"
								asChild
							>
								<Link to="/account/settings" hash="devices">
									<Monitor className="size-4" />
									Active Sessions
									<ExternalLink className="ml-auto size-3" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
