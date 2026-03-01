import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const placeholder = "PASTE_NOROFF_API_KEY_HERE";
const apiKey = process.env.NOROFF_API_KEY || placeholder;
const outputPath = resolve("js/runtime-config.js");

const fileContent = `window.__NOROFF_API_KEY__ = ${JSON.stringify(apiKey)};\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, fileContent, "utf8");

if (apiKey === placeholder) {
  console.log("runtime-config: using placeholder API key");
} else {
  console.log("runtime-config: API key injected from NOROFF_API_KEY");
}
