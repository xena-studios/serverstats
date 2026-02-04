import {
	Body,
	Button,
	Container,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { env } from "@/env";

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const heading = {
	fontSize: "24px",
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#484848",
	padding: "17px 0 0",
};

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#3c4149",
};

const buttonContainer = {
	padding: "27px 0 27px",
};

const button = {
	backgroundColor: "#5e6ad2",
	borderRadius: "3px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "11px 23px",
};

const reportLink = {
	fontSize: "14px",
	color: "#b4becc",
};

const hr = {
	borderColor: "#dfe1e4",
	margin: "42px 0 26px",
};

export function MagicLinkEmail({ signInURL }: { signInURL: string }) {
	return (
		<Html>
			<Body style={main}>
				<Preview>Your sign-in link for ServerStats</Preview>
				<Container style={container}>
					<Heading style={heading}>Your sign-in link for ServerStats</Heading>
					<Section style={buttonContainer}>
						<Button style={button} href={signInURL}>
							Sign in to Your Account
						</Button>
					</Section>
					<Text style={paragraph}>
						This link will only be valid for the next 5 minutes. If the link
						does not work, you can request another sign-in email.
					</Text>
					<Hr style={hr} />
					<Link href={env.VITE_APP_URL} style={reportLink}>
						ServerStats
					</Link>
				</Container>
			</Body>
		</Html>
	);
}
