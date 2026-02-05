import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		devtools(),
		nitro({
			// Fixes issue with Nitro not bundling reflect-metadata which is required by better-auth/passkey.
			rollupConfig: {
				plugins: [
					{
						name: "inject-reflect-metadata",
						banner: () => `import "reflect-metadata";`,
					},
				],
			},
			noExternals: ["reflect-metadata"],
		}),
		tailwindcss(),
		tanstackStart(),
		tsconfigPaths(),
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 3000,
	},
});

export default config;
