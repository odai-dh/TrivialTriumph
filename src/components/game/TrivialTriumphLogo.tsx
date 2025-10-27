import { cn } from "@/lib/utils"

export default function TrivialTriumphLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 40"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("font-headline", className)}
            aria-label="Trivial Triumph"
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <text x="0" y="30" fontSize="32" fontWeight="bold" fill="url(#logo-gradient)">
                Trivial Triumph
            </text>
        </svg>
    );
}
