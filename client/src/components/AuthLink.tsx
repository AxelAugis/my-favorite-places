import { Link } from "@tanstack/react-router";

interface AuthLinkProps {
    variant: "primary" | "outline";
    url: string;
}

export default function AuthLink({ variant, url }: Readonly<AuthLinkProps>) {

    const backgroundClass = variant === "primary" ? 
    "bg-[#E0F6EB] hover:bg-[#C2E0D2] text-[#0A3633] border border-transparent" : 
    "border border-[#E0F6EB] text-[#E0F6EB] hover:bg-[#E0F6EB]/20 hover:text-[#E0F6EB] hover:border-transparent";

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
