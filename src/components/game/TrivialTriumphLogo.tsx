import { cn } from "@/lib/utils"

export default function TrivialTriumphLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 280 50"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("font-headline", className)}
            aria-label="Trivial Triumph"
            preserveAspectRatio="xMinYMid meet"
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }}>
                        <animate attributeName="stop-color" values="hsl(219, 83%, 58%); hsl(43, 93%, 51%); hsl(219, 83%, 58%)" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }}>
                        <animate attributeName="stop-color" values="hsl(43, 93%, 51%); hsl(219, 83%, 58%); hsl(43, 93%, 51%)" dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
            </defs>
            <text x="10" y="35" fontSize="28" fontWeight="bold" fill="url(#logo-gradient)">
                Trivial Triumph
            </text>
        </svg>
    );
}