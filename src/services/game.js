import meta from "../data/championMeta.json";
import rawMeta from "../data/championMeta.json";


export function norm(s = "") {
    return s
        .toLowerCase()
        .replace(/[’'`]/g, "")
        .replace(/\s+/g, "");
}



export function judge(answer, guess) {
    const a = answer;
    const g = guess;

    let roleMatch = "unknown";
    if (Array.isArray(a.tags) && Array.isArray(g.tags)) {
        const overlap = g.tags.filter(t => a.tags.includes(t));

        if (overlap.length === 0) {
            roleMatch = "mismatch";
        } else if (
            overlap.length === a.tags.length &&
            overlap.length === g.tags.length
        ) {
            roleMatch = "match";
        } else {
            roleMatch = "partial";
        }
    }

    const resource = a.partype && g.partype
        ? (a.partype === g.partype ? "match" : "mismatch")
        : "unknown";

    // --- Difficulty (if you add later) ---
    // const aDiff = a.info?.difficulty ?? null;
    // const gDiff = g.info?.difficulty ?? null;
    // let difficulty = "unknown";
    // if (aDiff != null && gDiff != null) {
    //     difficulty = gDiff === aDiff ? "match" : (gDiff < aDiff ? "higher" : "lower");
    // }

    const am = getMetaById(answer.id) || {};
    const gm = getMetaById(guess.id) || {};

    let year = "unknown";
    if (am.releaseYear && gm.releaseYear) {
        year =
            gm.releaseYear === am.releaseYear
                ? "match"
                : gm.releaseYear < am.releaseYear
                    ? "higher"
                    : "lower";
    }

    const region =
        am.region && gm.region
            ? (am.region === gm.region ? "match" : "mismatch")
            : "unknown";

    const gender =
        am.gender && gm.gender
            ? (am.gender === gm.gender ? "match" : "mismatch")
            : "unknown";

    const attack =
        am.attack && gm.attack
            ? (am.attack === gm.attack ? "match" : "mismatch")
            : "unknown";

    return { role: roleMatch, resource, attack, year, region, gender };
}


export function pillClass(result) {
    switch (result) {
        case "match": return "pill pill--match";
        case "partial": return "pill pill--partial";
        case "higher": return "pill pill--higher";
        case "lower": return "pill pill--lower";
        case "mismatch": return "pill pill--mismatch";
        default: return "pill pill--unknown";
    }
}
const ALIAS = {
    Chogath: "ChoGath",
    Kaisa: "Kai'Sa",
    Belveth: "Bel'Veth",
    KogMaw: "Kog'Maw",
    Velkoz: "Vel'Koz",
    MonkeyKing: "Wukong",
    DrMundo: "Dr. Mundo",
    JarvanIV: "Jarvan IV",
    LeeSin: "Lee Sin",
    MissFortune: "Miss Fortune",
    RekSai: "Rek'Sai",
    TahmKench: "Tahm Kench",
    TwistedFate: "Twisted Fate",
    XinZhao: "Xin Zhao",
    AurelionSol: "Aurelion Sol"
};

function getMetaById(id) {

    if (rawMeta[id]) return rawMeta[id];

    const pretty = ALIAS[id];
    if (pretty && rawMeta[pretty]) return rawMeta[pretty];
    return null;
}

export function pickRandom(champs) {
    if (!Array.isArray(champs) || champs.length === 0) return null;

    let r = Math.random();
    try {
        if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
            const buf = new Uint32Array(1);
            window.crypto.getRandomValues(buf);
            r = buf[0] / 2 ** 32;
        }
    } catch (_) {
    }

    return champs[Math.floor(r * champs.length)];
}