import { Link } from "@tanstack/react-router";

interface AuthButtonProps {
    variant: "primary" | "outline";
    url: string;
}

export default function AuthButton({ variant, url }: Readonly<AuthButtonProps>) {

    const backgroundClass = variant === "primary" ? 
    "bg-gray-600 text-gray-100 hover:bg-gray-700 border border-transparent" : 
    "border border-gray-300 text-gray-100 hover:bg-gray-100 hover:text-gray-800";

    const text = variant === "primary" ? "Connexion" : "Inscription";

    return (
        <Link
            to={url}
            className={`px-4 py-1.5 rounded font-medium ${backgroundClass} transition-colors duration-200`}
        >
            {text}
        </Link>
    )
}