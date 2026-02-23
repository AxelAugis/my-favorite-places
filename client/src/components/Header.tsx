import { Link } from '@tanstack/react-router'
import AuthButton from './buttons/AuthButton'


export default function Header() {

  const authLinks = [
    { variant: "primary" as const, name: "Connexion", url: "/login" },
    { variant: "outline" as const, name: "Inscription", url: "/signup" },
  ]

  return (
    <header className="w-full p-4 flex justify-between items-center bg-gray-800 text-white shadow-lg">
      <h1 className="ml-4 text-xl font-semibold">
        <Link to="/">
          MFP
        </Link>
      </h1>
        <div className="flex items-center gap-x-6">
          {authLinks.map((link) => (
            <AuthButton key={link.name} variant={link.variant} url={link.url} />
          ))}
        </div>
    </header>
  )
}
