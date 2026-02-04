import { useNavigate } from "@tanstack/react-router";
import { Building2, Crown, Plus, Settings, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { CreateOrganizationDialog } from "@/components/dialogs/create-organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function getRoleBadge(role: string) {
	switch (role) {
		case "owner":
			return (
				<Badge variant="default" className="gap-1">
					<Crown className="size-3" />
					Owner
				</Badge>
			);
		case "admin":
			return (
				<Badge variant="secondary" className="gap-1">
					<Shield className="size-3" />
					Admin
				</Badge>
			);
		default:
			return <Badge variant="outline">Member</Badge>;
	}
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function OrganizationsList() {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const navigate = useNavigate();

	const { data: organizations, isPending } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const { data: member } = authClient.useActiveMember();

	const handleSelectOrganization = async (orgId: string) => {
		await authClient.organization.setActive({
			organizationId: orgId,
			fetchOptions: {
				onSuccess() {
					toast.success("Organization selected successfully!");
				},
				onError(context) {
					toast.error("Unable to select organization! Please try again.");
					console.error("Organization selection failed:", context.error);
				},
			},
		});
		navigate({ to: "/overview" });
	};

	const handleSettingsClick = async (orgId: string) => {
		await authClient.organization.setActive({
			organizationId: orgId,
			fetchOptions: {
				onSuccess() {
					toast.success("Organization selected successfully!");
				},
				onError(context) {
					toast.error("Unable to select organization! Please try again.");
					console.error("Organization selection failed:", context.error);
				},
			},
		});
		navigate({ to: "/settings" });
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="size-5" />
						Organizations
					</CardTitle>
					<CardDescription>
						Organizations you own or are a member of.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{isPending ? (
						<div className="py-8 text-center text-muted-foreground text-sm">
							Loading organizations...
						</div>
					) : !organizations || organizations.length === 0 ? (
						<div className="py-8 text-center">
							<Building2 className="mx-auto size-12 text-muted-foreground/50" />
							<p className="mt-4 text-muted-foreground text-sm">
								You're not part of any organizations yet.
							</p>
						</div>
					) : (
						organizations.map((org) => (
							<div
								key={org.id}
								className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
							>
								<div className="flex items-center gap-4">
									<Avatar className="size-12">
										<AvatarImage src={org.logo ?? undefined} alt={org.name} />
										<AvatarFallback className="bg-primary/10 font-medium text-primary">
											{getInitials(org.name)}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<h3 className="font-medium">{org.name}</h3>
											{getRoleBadge(member?.role ?? "member")}
										</div>
										<div className="flex items-center gap-1 text-muted-foreground text-sm">
											<span className="text-muted-foreground/70">
												{org.slug}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{activeOrganization?.id === org.id ? (
										<Button variant="ghost" size="sm" disabled>
											Active
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleSelectOrganization(org.id)}
										>
											Select
										</Button>
									)}
									<Button
										variant="ghost"
										size="icon"
										className="size-8"
										onClick={() => handleSettingsClick(org.id)}
									>
										<Settings className="size-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</CardContent>
				<CardFooter className="border-t pt-6">
					<Button
						variant="outline"
						className="gap-2 bg-transparent"
						onClick={() => setCreateDialogOpen(true)}
					>
						<Plus className="size-4" />
						Create Organization
					</Button>
				</CardFooter>
			</Card>

			<CreateOrganizationDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
			/>
		</>
	);
}
