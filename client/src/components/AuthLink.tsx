import { Link } from "@tanstack/react-router";

interface AuthLinkProps {
    variant: "primary" | "outline";
    url: string;
}

export default function AuthLink({ variant, url }: Readonly<AuthLinkProps>) {

    const backgroundClass = variant === "primary" ? 
    "bg-cyan-500 hover:bg-cyan-600 text-gray-100 border border-transparent" : 
    "border border-cyan-300 text-cyan-100 hover:bg-gray-200 hover:text-cyan-600 hover:border-transparent";

    const text = variant === "primary" ? "Connexion" : "Inscription";

    return (
        <Link
            to={url}
            preload={false}
            className={`px-4 py-1.5 rounded font-medium ${backgroundClass} transition-colors duration-200`}
            data-testid={`auth-link-${variant}`}
        >
            {text}
        </Link>
    )
}
