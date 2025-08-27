import meta from "../data/championMeta.json";
import rawMeta from "../data/championMeta.json";


export function norm(s = "") {
    return s
        .toLowerCase()
        .replace(/[’'`]/g, "")
        .replace(/\s+/g, "");
}


export function pickDaily(champions) {
    const today = new Date();
    const key = `${today.getUTCFullYear()}-${today.getUTCMonth()+1}-${today.getUTCDate()}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const idx = hash % champions.length;
    return champions[idx];
}


export function judge(answer, guess) {

    const a = answer;
    const g = guess;


    const roleMatch = g.tags?.some(t => a.tags?.includes(t)) ? "match" : "mismatch";

    const resource = a.partype && g.partype ? (a.partype === g.partype ? "match" : "mismatch") : "unknown";


    const aDiff = a.info?.difficulty ?? null;
    const gDiff = g.info?.difficulty ?? null;
    let difficulty = "unknown";
    if (aDiff != null && gDiff != null) {
        difficulty = gDiff === aDiff ? "match" : (gDiff < aDiff ? "higher" : "lower");
    }


    const am = getMetaById(answer.id) || {};
    const gm = getMetaById(guess.id) || {};

    let year = "unknown";
    if (am.releaseYear && gm.releaseYear) {
        year = gm.releaseYear === am.releaseYear ? "match" : (gm.releaseYear < am.releaseYear ? "higher" : "lower");
    }

    const region = am.region && gm.region ? (am.region === gm.region ? "match" : "mismatch") : "unknown";
    const gender = am.gender && gm.gender ? (am.gender === gm.gender ? "match" : "mismatch") : "unknown";

    return { role: roleMatch, resource, difficulty, year, region, gender };
}

export function pillClass(result) {
    switch (result) {
        case "match": return "pill pill--match";
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