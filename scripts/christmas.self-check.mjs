import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/christmas.css", import.meta.url), "utf8");
const luminance = (hex) => {
  const rgb = hex.slice(1).match(/../g).map((channel) => {
    const n = parseInt(channel, 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
assert.equal(contrast("#000000", "#ffffff"), 21);
const tokens = {};
for (const mode of ["", ".dark"]) {
  const block = css.split(`html[data-season="christmas"]${mode} {`)[1].split("}")[0];
  for (const [, key, value] of block.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/g)) tokens[key] = value;
  for (const [fg, bg] of [
    ["foreground", "background"], ["status-open", "card"], ["status-closed", "card"], ["foreground-muted", "card"],
    ["accent-foreground", "accent"], ["accent-foreground", "accent-hover"],
    ["accent", "card"], ["season-paper", "season-ribbon"], ["season-pine", "card"], ["season-berry", "card"],
  ]) {
    const ratio = contrast(tokens[fg], tokens[bg]);
    assert.ok(ratio >= 4.5, `${mode || "light"}: ${fg}/${bg} = ${ratio.toFixed(2)}`);
    console.log(`${mode || "light"}: ${fg}/${bg} ${ratio.toFixed(2)}:1`);
  }
}
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(css, /\.christmas-bulb, \.christmas-steam\).*animation: none/s);
console.log("Christmas tokens: AA, reduced motion passed.");
