import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
	site: "https://hackmycareer.lol",
	integrations: [tailwind()],
	output: "static",
	adapter: vercelStatic(),
});
