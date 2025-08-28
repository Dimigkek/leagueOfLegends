export function DownArrow({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="currentColor"
            viewBox="0 0 24 24"
            className={className}
        >
            <path d="M4 10h5V3h6v7h5l-8 11-8-11z" />
        </svg>
    );
}
