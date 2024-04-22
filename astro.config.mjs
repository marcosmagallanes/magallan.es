import { defineConfig } from "astro/config";
import sectionize from "./src/lib/sectionize.mjs";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [sectionize],
  },
});
