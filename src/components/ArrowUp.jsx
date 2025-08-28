export function UpArrow({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="currentColor"
            viewBox="0 0 24 24"
            className={className}
        >
            <path d="M20 14h-5v7H9v-7H4l8-11 8 11z" />
        </svg>
    );
}
