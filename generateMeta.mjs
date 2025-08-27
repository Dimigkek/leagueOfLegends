// generateMeta.mjs
// Node 18+ (built-in fetch). Run: node generateMeta.mjs
import fs from "node:fs/promises";

// OUTPUT
const OUT_PATH = "./src/data/championMeta.json";
const LANG = "en_US";

// polite delay between API calls
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// pull DDragon champ list (authoritative IDs + pretty names)
async function getLatestVersion() {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
        headers: { "User-Agent": "meta-generator/1.0" }
    });
    if (!res.ok) throw new Error("Failed versions.json");
    const data = await res.json();
    return data[0];
}
async function getAllChampions(version) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${LANG}/champion.json`;
    const res = await fetch(url, { headers: { "User-Agent": "meta-generator/1.0" } });
    if (!res.ok) throw new Error("Failed champion.json");
    const data = await res.json();
    return Object.values(data.data); // [{ id, name, ... }]
}

// MediaWiki API: fetch raw wikitext of infobox for a champion page
async function getWikiWikitext(page) {
    const url = `https://leagueoflegends.fandom.com/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json`;
    const res = await fetch(url, {
        headers: { "User-Agent": "meta-generator/1.0" }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.parse?.wikitext?.["*"] || null;
}

// Try common page title variants for each champ
function candidatePages(name, id) {
    const base = name;
    const variants = new Set([
        base,
        `${base} (League of Legends)`,
        // special known IDs to pretty-name mapping adjustments
        id === "MonkeyKing" ? "Wukong" : null,
        id === "Belveth" ? "Bel'Veth" : null,
        id === "Chogath" ? "Cho'Gath" : null,
        id === "Kaisa" ? "Kai'Sa" : null,
        id === "Khazix" ? "Kha'Zix" : null,
        id === "KogMaw" ? "Kog'Maw" : null,
        id === "Leblanc" ? "LeBlanc" : null,
        id === "LeeSin" ? "Lee Sin" : null,
        id === "MissFortune" ? "Miss Fortune" : null,
        id === "RekSai" ? "Rek'Sai" : null,
        id === "JarvanIV" ? "Jarvan IV" : null,
        id === "AurelionSol" ? "Aurelion Sol" : null,
        id === "KSante" ? "K'Sante" : null
    ].filter(Boolean));
    return [...variants];
}

// Parse release year from wikitext
function parseReleaseYear(wikitext) {
    if (!wikitext) return null;

    // Patterns to catch:
    // | release       = 2011-12-14
    // | release       = 14-12-2011
    // | release       = {{Release date|2011|12|14}}
    // Sometimes "release" is "release date"
    const line = (wikitext.match(/\|\s*release(?:\s*date)?\s*=\s*([^\n]+)/i)?.[1] || "").trim();

    if (!line) return null;

    // Template {{Release date|YYYY|MM|DD}}
    const t1 = line.match(/\{\{\s*Release date\s*\|\s*(\d{4})\s*\|\s*\d{1,2}\s*\|\s*\d{1,2}\s*\}\}/i);
    if (t1) return parseInt(t1[1], 10);

    // YYYY-MM-DD
    const ymd = line.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (ymd) return parseInt(ymd[1], 10);

    // DD-MM-YYYY
    const dmy = line.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (dmy) return parseInt(dmy[3], 10);

    // Long month formats e.g. December 14, 2011
    const long = line.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+(\d{4})/i);
    if (long) return parseInt(long[2], 10);

    // Fallback: search entire wikitext for first YYYY-.. date near "release"
    const vicinity = wikitext.match(/release[^|]*?(\d{4})/i);
    if (vicinity) return parseInt(vicinity[1], 10);

    return null;
}

// Parse region(s) from wikitext
function parseRegion(wikitext) {
    if (!wikitext) return null;
    // Common: |region = Ionia, sometimes {{Lore|Ionia}} or a list
    let line = (wikitext.match(/\|\s*region\s*=\s*([^\n]+)/i)?.[1] || "").trim();
    if (!line) return null;
    // Strip templates like {{Lore|Ionia}} → Ionia
    line = line.replace(/\{\{[^|{]+?\|/g, "").replace(/\}\}/g, "");
    // Remove wiki links [[Ionia]] -> Ionia
    line = line.replace(/\[\[|\]\]/g, "");
    // Take first region if multiple (you can keep array if you want)
    const first = line.split(/[,\/]|and/)[0].trim();
    return first || null;
}

// Parse gender from wikitext (very heuristic)
function parseGender(wikitext) {
    if (!wikitext) return "Unknown";
    let line = (wikitext.match(/\|\s*gender\s*=\s*([^\n]+)/i)?.[1] || "").trim();
    if (line) {
        line = line.replace(/\{\{[^|{]+?\|/g, "").replace(/\}\}/g, "");
        line = line.replace(/\[\[|\]\]/g, "");
        line = line.replace(/<[^>]+>/g, "").trim();
        // normalize
        const norm = line.toLowerCase();
        if (/(^|[^\w])male([^\w]|$)/i.test(line)) return "Male";
        if (/(^|[^\w])female([^\w]|$)/i.test(line)) return "Female";
        if (/non[- ]?binary|agender|genderless|other/i.test(line)) return "Other";
    }
    // Otherwise infer from lore pronouns (weak; skip to Unknown)
    return "Unknown";
}

async function fetchOneChampionMeta(prettyName, id) {
    const pages = candidatePages(prettyName, id);
    for (const page of pages) {
        try {
            const text = await getWikiWikitext(page);
            if (!text) {
                await sleep(150);
                continue;
            }
            const releaseYear = parseReleaseYear(text);
            const region = parseRegion(text);
            const gender = parseGender(text);
            // if we at least got a year or region or a concrete gender, accept
            if (releaseYear || region || (gender && gender !== "Unknown")) {
                return { releaseYear: releaseYear ?? null, region: region ?? null, gender: gender ?? "Unknown" };
            }
            // sometimes release is missing on the main page but present with "(League of Legends)"
            await sleep(150);
        } catch {
            await sleep(150);
        }
    }
    // last resort: nulls
    return { releaseYear: null, region: null, gender: "Unknown" };
}

async function main() {
    const version = await getLatestVersion();
    const champs = await getAllChampions(version);

    const meta = {};
    let done = 0;

    for (const c of champs) {
        const { id, name } = c;
        const info = await fetchOneChampionMeta(name, id);
        meta[id] = info;
        done++;
        // progress log
        if (done % 10 === 0) console.log(`Processed ${done}/${champs.length}…`);
        // be polite to the wiki
        await sleep(250);
    }

    await fs.mkdir("./src/data", { recursive: true });
    await fs.writeFile(OUT_PATH, JSON.stringify(meta, null, 2), "utf-8");
    console.log(`\nWrote ${Object.keys(meta).length} entries to ${OUT_PATH}`);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
