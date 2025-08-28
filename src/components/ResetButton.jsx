export default function GameButton({ onClick, children }) {
    return (
        <button
            className="play-btn"
            onClick={onClick}
        >
            {children}
        </button>
    );
}