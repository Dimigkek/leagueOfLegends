import { useEffect, useMemo, useState } from "react";
import { getChampions } from "../services/api";
import { norm, pickRandom, judge, pillClass } from "../services/game";
import "../css/GamePage.css";
import NavBar from "../components/NavBar";
import meta from "../data/championMeta.json";
import {DownArrow} from "../components/ArrowDown";
import {UpArrow} from "../components/ArrowUp";

export default function LoldleClassic() {
    const [champs, setChamps] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [query, setQuery] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await getChampions();
                data.sort((a, b) => a.name.localeCompare(b.name));
                setChamps(data);
                const a = pickRandom(data);
                console.log("Picked answer:", a?.id, a?.name);
                setAnswer(a);
            } catch (e) {
                setError("Failed to load champions.");
            }
        })();
    }, []);

    useEffect(() => {
        if (!champs.length) return;
        const missing = champs.filter(c => !meta[c.id]).map(c => c.id);
        console.log("Missing meta for:", missing);
    }, [champs]);

    const suggestions = useMemo(() => {
        const q = norm(query);
        if (!q) return [];
        return champs.filter(c => norm(c.name).startsWith(q)).slice(0, 10);
    }, [query, champs]);

    function submitGuess(name) {
        const guess = champs.find(c => norm(c.name) === norm(name));
        if (!guess) return;
        const result = judge(answer, guess);
        setGuesses(prev => [{ champ: guess, result }, ...prev]);
        setQuery("");
    }

    if (error) return <div style={{ color: "crimson", padding: 24 }}>{error}</div>;
    if (!answer || champs.length === 0) return <div style={{ padding: 24 }}>Loading…</div>;

    const won = guesses.some(g => g.champ.id === answer.id);

    return <div className="loldle">
        <title>Game</title>
        <NavBar/>

            <h1 className="loldle-title">Find the Champion</h1>

            <div className="loldle-input">
                {!won?(<input
                    type="text"
                    placeholder="Type a champion..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") submitGuess(query); }}
                />):(<div className="win-banner">
                    <div>
                        ✅ You got it! Answer: <strong>{answer.name}</strong>
                    </div>
                    <div>
                        <button
                            className="play-btn"
                            onClick={() => {
                                const a = pickRandom(champs);
                                console.log("Picked answer:", a?.id, a?.name);
                                setAnswer(a);
                                setGuesses([]);
                            }}
                        >
                            New Game
                        </button>
                    </div>
                </div>)}
                {query && suggestions.length > 0 && (
                    <ul className="loldle-suggest">
                        {suggestions.map(s => (
                            <li key={s.id} onClick={() => submitGuess(s.name)}>
                                <img src={s.icon} alt={s.name} />
                                <span>{s.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        <div className="loldle-rows">
            {guesses.map(({ champ, result }, i) => {
                // derive display values from the *guess*
                const role =
                    (Array.isArray(champ.tags) && champ.tags.length
                        ? champ.tags.join(" / ")
                        : "—");

                const resource = champ.partype || "None";

                const diffNum = champ.info?.difficulty ?? 0; // 0..10
                const difficulty =
                    diffNum >= 8 ? "Hard" : diffNum >= 4 ? "Moderate" : "Easy";

                const year = meta[champ.id]?.releaseYear ?? "—";
                const region = meta[champ.id]?.region ?? "—";
                const gender = meta[champ.id]?.gender ?? "—";

                return (
                    <div key={i} className="guess-row">
                        <div className="guess-name">
                            <img src={champ.icon} alt={champ.name} />
                            <strong>{champ.name}</strong>
                        </div>
                        <div className={pillClass(result.role)}>{role}</div>
                        <div className={pillClass(result.resource)}>{resource}</div>
                        <div className={pillClass(result.difficulty)}>{difficulty}</div>
                        <div className={pillClass(result.year)}>
                            {pillClass(result.year) === "pill pill--higher"
                                ? <>
                                        {year}
                                        <UpArrow size={16} className="arrow-up" />
                                </>
                                : pillClass(result.year) === "pill pill--lower"
                                    ? <>
                                            {year}
                                            <DownArrow size={16} className="arrow-down" />
                                </>
                                    : year}
                        </div>
                        <div className={pillClass(result.region)}>{region}</div>
                        <div className={pillClass(result.gender)}>{gender}</div>
                    </div>
                );
            })}
        </div>
        </div>
}
