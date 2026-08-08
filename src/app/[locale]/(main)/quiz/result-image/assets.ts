import { readFile } from "node:fs/promises";
import { join } from "node:path";

type ExportFontWeight = 400 | 500 | 600 | 700 | 800;
type ExportFont = { name: string; data: ArrayBuffer; weight: ExportFontWeight; style: "normal" };

export async function imageToDataUrl(url: URL) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Image missing");
  const input = Buffer.from(await response.arrayBuffer());
  const sharp = (await import("sharp")).default;
  return `data:image/png;base64,${(await sharp(input).png().toBuffer()).toString("base64")}`;
}

export async function loadExportFonts(): Promise<ExportFont[]> {
  const [plusJakarta400, plusJakarta500, plusJakarta600, plusJakarta700, plusJakarta800, lora700] = await Promise.all([
    readFont("PlusJakartaSans-400.ttf"),
    readFont("PlusJakartaSans-500.ttf"),
    readFont("PlusJakartaSans-600.ttf"),
    readFont("PlusJakartaSans-700.ttf"),
    readFont("PlusJakartaSans-800.ttf"),
    readFont("Lora-700.ttf"),
  ]);
  return [
    { name: "Plus Jakarta Sans", data: plusJakarta400, weight: 400, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta500, weight: 500, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta600, weight: 600, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta700, weight: 700, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta800, weight: 800, style: "normal" },
    { name: "Lora", data: lora700, weight: 700, style: "normal" },
  ];
}

function readFont(file: string) {
  return readFile(join(process.cwd(), "src/assets/fonts", file)).then(toArrayBuffer);
}

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
