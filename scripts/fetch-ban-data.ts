import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { description } from "valibot";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, ".");

const fetchMaskBanData = async () => {};

const NO_BANS_TEXT = "No known state laws or bills.";

interface MaskBan {
  enactedYear: number;
  description: string;
  url: string;
}

interface MaskBanData {
  state: string;
  bans: MaskBan[] | null;
  notes: string[];
}

const prepareHtml = (html: string) => {
  // Remove all class attributes
  const cleanHtml = html
    .replaceAll(/ class=".*?"/g, "") // Remove all class attributes
    .replaceAll(/ style=".*?"/g, ""); // Remove all style attributes

  return cleanHtml;
};

const extractInsideTag = (html: string, tag: string) => {
  const regex = new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`, "g");
  const matches = html.match(regex);
  if (!matches) {
    return [];
  }
  return matches;
};

// Go until next occurrence of <h2>
const splitByTag = (html: string, tag: string) => {
  const sections: string[][] = [];
  const lines = html.split("\n");

  let section = [lines[0]];
  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];
    section.push(line);

    if (line.includes(`<${tag}`)) {
      section = [];
      sections.push(section);
    }
  }

  return sections;
};

// const REGEX = /<\/h2>\s*([^<]*(?:<(?!h2)[^<]*)*?)\s*(?:<h2|$)/g;

async function parseHtmlFile(filename: string): Promise<MaskBanData[]> {
  const htmlContent = await fs.readFile(`${root}/${filename}`, "utf-8");

  const html = prepareHtml(htmlContent);
  // Split by h2 tags on line
  const sections = splitByTag(html, "h2");
  console.log(`Number of sections: ${sections.length}`);

  const banData: MaskBanData[] = [];
  sections.map((sectionGroup) => {
    const section = sectionGroup.join("\n");
    const state = section.match(/<h2.*?>(.*?)<\/h2>/)?.[1];
    // if (!state) {
    //   console.warn("State not found in section");
    // }

    // check if no bans text is present
    if (section.includes(NO_BANS_TEXT)) {
      return {
        state,
        bans: null,
        notes: [],
      };
    }

    const bans = splitByTag(section, "p").map((p) => {
      const text = p.join("\n");
      const url = extractInsideTag(text, "a")[0];

      return {
        description: text.replace(url, "").trim(),
        url,
        enactedYear: Number.parseInt(
          text.match(/(enacted in )(\d{4})/)?.[2] ?? "",
        ),
      };
    });
    // if (!bans) {
    //   console.warn("State not found in section");
    // }

    banData.push({
      state: state?.trim() ?? "",
      bans: bans ?? [],
      notes: [],
    });
  });

  return banData;
}

const data = await parseHtmlFile("example-ban-data.html");
console.log(JSON.stringify(data, null, 2));
