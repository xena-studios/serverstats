import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/auth/client";
import { CreateOrganizationDialog } from "@/components/dialogs/create-organization";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function OrganizationSidebar() {
	const { isMobile } = useSidebar();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	const { data: organizations } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const handleSelectOrganization = async (orgId: string) => {
		await authClient.organization.setActive({
			organizationId: orgId,
		});
	};

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg">
										{activeOrganization?.name?.charAt(0) ?? "?"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{activeOrganization?.name ?? "Select Organization"}
									</span>
									{activeOrganization?.slug && (
										<span className="truncate text-muted-foreground text-xs">
											{activeOrganization.slug}
										</span>
									)}
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="start"
							sideOffset={4}
						>
							{organizations?.map((org) => (
								<DropdownMenuItem
									key={org.id}
									onClick={() => handleSelectOrganization(org.id)}
									className="gap-2 p-2"
								>
									<Avatar className="h-6 w-6 rounded-md">
										<AvatarFallback className="rounded-md text-xs">
											{org.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">{org.name}</span>
									{activeOrganization?.id === org.id && (
										<span className="ml-auto text-muted-foreground text-xs">
											Active
										</span>
									)}
								</DropdownMenuItem>
							))}
							{organizations && organizations.length > 0 && (
								<DropdownMenuSeparator />
							)}
							<DropdownMenuItem
								className="gap-2 p-2"
								onSelect={() => setCreateDialogOpen(true)}
							>
								<div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<span>Create Organization</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<CreateOrganizationDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
			/>
		</>
	);
}
