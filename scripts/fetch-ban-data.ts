import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type HTMLElement, parse } from "node-html-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, ".");

const NO_BANS_TEXT = [
  "No known state laws or bills.",
  "No current state laws.",
];

interface MaskBan {
  locationValue: string;
  locationType: "state" | "city" | "county" | "other";
  notes: string[];
  text: string;
  punishment?: string;
  when?: number;
  url?: string;
}

function cleanDescription(text: string): string {
  return text
    .replace(/\s+/g, " ") // Replace multiple whitespace characters with a single space
    .replace(/\n/g, " ") // Replace newline characters with a space
    .replace(/^\s+|\s+$/g, "") // Trim leading and trailing whitespace
    .replace(/\s+([.,!?])/g, "$1") // Remove spaces before punctuation
    .replace(/([.,!?])\s+/g, "$1 "); // Ensure one space after punctuation
}

const parseHtml = async (html: string) => {
  const root = parse(html);
  const headers = root.querySelectorAll("h2");

  const bans: MaskBan[] = [];
  const ban = {} as MaskBan;

  headers.forEach((header, _) => {
    let currentNode = header.nextElementSibling;

    const state = header.innerText.trim();
    ban.locationValue = state;
    ban.locationType = "state";

    while (currentNode) {
      const text = currentNode.innerText.trim();

      if (text.startsWith("Current law")) {
        const description = text.replace("Current law", "").trim();
        bans.push({
          text: cleanDescription(description),
          type: "law",
        });
      } else if (text.startsWith("Sentence")) {
        const sentence = text.replace("Sentence:", "").trim();
        ban.sentence = cleanDescription(sentence);
      } else if (text.startsWith("Note:")) {
        const note = text.replace("Note:", "").trim();
        notes.push(cleanDescription(note));
      }
      const anchor = currentNode.querySelector("a");
      ban.url = anchor?.getAttribute("href") || undefined;

      const matches = text.match(/(enacted in )(\d{4})/);
      ban.enactedYear = matches ? Number.parseInt(matches[2]) : undefined;

      currentNode = currentNode.nextElementSibling;
    }

    data.push({
      state: header.innerText.trim(),
      bans,
      notes,
    });
  });

  return data;
};

// const data = await parseHtmlFile("example-ban-data.html");
const filename = "example-ban-data.html";
const htmlContent = await fs.readFile(`${root}/${filename}`, "utf-8");
const data = await parseHtml(htmlContent);
console.log(JSON.stringify(data, null, 2));
