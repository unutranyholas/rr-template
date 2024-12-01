import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { hsl, oklch } from "culori";

function convertHslToOklch(hslValue: string): string {
  // Parse HSL string like "240 10% 3.9%"
  const [h, s, l] = hslValue
    .split(" ")
    .map((v) =>
      v.endsWith("%") ? Number.parseFloat(v) / 100 : Number.parseFloat(v),
    );

  // Convert to culori HSL object
  const color = hsl({ h, s, l });

  // Convert to OKLCH
  const oklchColor = oklch(color);

  // Format with appropriate precision
  return `${(oklchColor.l * 100).toFixed(1)}% ${oklchColor.c.toFixed(3)} ${oklchColor.h?.toFixed(1) || 0}`;
}

function updateCssFile() {
  const cssPath = path.join(process.cwd(), "app", "app.css");
  let content = readFileSync(cssPath, "utf-8");

  // Regular expression to match HSL variable declarations
  const hslRegex = /(--[a-zA-Z0-9-]+):\s*([0-9.]+\s+[0-9.]+%\s+[0-9.]+%)/g;

  content = content.replace(hslRegex, (match, varName, hslValue) => {
    const oklchValue = convertHslToOklch(hslValue);
    return `${varName}: ${oklchValue}`;
  });

  // Update HSL function calls to OKLCH
  content = content.replace(
    /hsl\(var\((--[a-zA-Z0-9-]+)\)\)/g,
    "oklch(var($1))",
  );

  writeFileSync(cssPath, content, "utf-8");
  console.log("✅ Converted HSL values to OKLCH in app.css");
}

updateCssFile();
