import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { OrganizationSidebar } from "./organization";
import { UserSidebar } from "./user";

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<OrganizationSidebar />
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<UserSidebar />
			</SidebarFooter>
		</Sidebar>
	);
}
