import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Session = {
	token: string;
	userAgent?: string | null;
	ipAddress?: string | null;
	createdAt: Date;
};

export function DevicesCard() {
	const { data: currentSession } = authClient.useSession();
	const [sessions, setSessions] = useState<Session[]>([]);

	const [signOutAllDialogOpen, setSignOutAllDialogOpen] = useState(false);
	const [isSigningOutAll, setIsSigningOutAll] = useState(false);

	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
	const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);
	const [isRevokingSession, setIsRevokingSession] = useState(false);

	const fetchSessions = useCallback(async () => {
		const result = await authClient.listSessions();
		if (result.data) {
			setSessions(result.data);
		}
	}, []);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	const getDeviceInfo = (userAgent?: string | null) => {
		if (!userAgent) return { name: "Unknown Device", type: "desktop" };

		const ua = userAgent.toLowerCase();

		if (ua.includes("iphone")) return { name: "iPhone", type: "mobile" };
		if (ua.includes("ipad")) return { name: "iPad", type: "tablet" };
		if (ua.includes("android") && ua.includes("mobile"))
			return { name: "Android Phone", type: "mobile" };
		if (ua.includes("android"))
			return { name: "Android Tablet", type: "tablet" };
		if (ua.includes("macintosh") || ua.includes("mac os"))
			return { name: "Mac", type: "desktop" };
		if (ua.includes("windows")) return { name: "Windows PC", type: "desktop" };
		if (ua.includes("linux")) return { name: "Linux PC", type: "desktop" };

		return { name: "Unknown Device", type: "desktop" };
	};

	const getDeviceIcon = (type: string) => {
		switch (type) {
			case "mobile":
				return <Smartphone className="size-5" />;
			case "tablet":
				return <Tablet className="size-5" />;
			default:
				return <Monitor className="size-5" />;
		}
	};

	const formatLastActive = (createdAt: Date) => {
		const now = new Date();
		const date = new Date(createdAt);
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 5) return "Active now";
		if (diffMins < 60) return `${diffMins} minutes ago`;
		if (diffHours < 24)
			return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
		if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const handleRevokeSession = async () => {
		if (!sessionToRevoke) return;

		setIsRevokingSession(true);
		try {
			await authClient.revokeSession({
				token: sessionToRevoke.token,
				fetchOptions: {
					onSuccess() {
						toast.success("Device signed out successfully!");
						setSignOutDialogOpen(false);
						setSessionToRevoke(null);
						fetchSessions();
					},
					onError(context) {
						toast.error("Failed to sign out device. Please try again.");
						console.error("Session revoke failed:", context.error.message);
					},
				},
			});
		} finally {
			setIsRevokingSession(false);
		}
	};

	const handleSignOutAllDevices = async () => {
		setIsSigningOutAll(true);
		try {
			await authClient.revokeOtherSessions({
				fetchOptions: {
					onSuccess() {
						toast.success("Signed out of all other devices!");
						setSignOutAllDialogOpen(false);
						fetchSessions();
					},
					onError(context) {
						toast.error("Failed to sign out devices. Please try again.");
						console.error("Sign out all failed:", context.error.message);
					},
				},
			});
		} finally {
			setIsSigningOutAll(false);
		}
	};

	const sortedSessions = [...sessions].sort((a, b) => {
		const aIsCurrent = a.token === currentSession?.session?.token;
		const bIsCurrent = b.token === currentSession?.session?.token;

		if (aIsCurrent) return -1;
		if (bIsCurrent) return 1;

		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const otherSessions = sessions.filter(
		(session) => session.token !== currentSession?.session?.token
	);

	return (
		<>
			<Card id="devices">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Monitor className="size-5" />
						Devices
					</CardTitle>
					<CardDescription>
						Manage devices that are currently logged into your account.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{sortedSessions.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
							<div className="flex size-12 items-center justify-center rounded-full bg-muted">
								<Monitor className="size-6 text-muted-foreground" />
							</div>
							<h3 className="mt-4 font-medium">No sessions found</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Unable to load your active sessions.
							</p>
						</div>
					) : (
						sortedSessions.map((session) => {
							const isCurrent =
								session.token === currentSession?.session?.token;
							const deviceInfo = getDeviceInfo(session.userAgent);

							return (
								<div
									key={session.token}
									className="flex items-center justify-between rounded-lg border p-4"
								>
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full bg-muted">
											{getDeviceIcon(deviceInfo.type)}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<p className="font-medium">{deviceInfo.name}</p>
												{isCurrent && (
													<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
														This device
													</span>
												)}
											</div>
											<p className="text-muted-foreground text-sm">
												{session.ipAddress || "Unknown location"} •{" "}
												{formatLastActive(session.createdAt)}
											</p>
										</div>
									</div>
									{!isCurrent && (
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive hover:bg-destructive/10 hover:text-destructive"
											onClick={() => {
												setSessionToRevoke(session);
												setSignOutDialogOpen(true);
											}}
										>
											Sign out
										</Button>
									)}
								</div>
							);
						})
					)}
				</CardContent>
				{otherSessions.length > 0 && (
					<CardFooter className="border-t pt-6">
						<Button
							variant="outline"
							className="bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
							onClick={() => setSignOutAllDialogOpen(true)}
						>
							Sign out all other devices
						</Button>
					</CardFooter>
				)}
			</Card>

			<AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Sign out device</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to sign out{" "}
							<span className="font-medium">
								{sessionToRevoke
									? getDeviceInfo(sessionToRevoke.userAgent).name
									: "this device"}
							</span>
							? They'll need to sign in again to access their account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setSignOutDialogOpen(false);
								setSessionToRevoke(null);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleRevokeSession}
							disabled={isRevokingSession}
						>
							{isRevokingSession ? "Signing out..." : "Sign out"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={signOutAllDialogOpen}
				onOpenChange={setSignOutAllDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Sign out all other devices</AlertDialogTitle>
						<AlertDialogDescription>
							This will sign you out of all devices except the one you're
							currently using. You'll need to sign in again on those devices.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleSignOutAllDevices}
							disabled={isSigningOutAll}
						>
							{isSigningOutAll
								? "Signing out..."
								: "Sign out all other devices"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
