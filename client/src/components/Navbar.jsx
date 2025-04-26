import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Project Utopia
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/map" className="text-sm font-medium hover:text-primary">
            Map
          </Link>
          <Link to="/shelters" className="text-sm font-medium hover:text-primary">
            Shelters
          </Link>
          <Link to="/profile" className="text-sm font-medium hover:text-primary">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}