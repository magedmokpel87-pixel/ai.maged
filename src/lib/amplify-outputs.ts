import fs from "node:fs";
import path from "node:path";

export function loadAmplifyOutputs(): Record<string, unknown> | null {
  try {
    const file = path.join(process.cwd(), "amplify_outputs.json");
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}
