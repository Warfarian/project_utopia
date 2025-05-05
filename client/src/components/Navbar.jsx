import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Project Utopia
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/map" className="text-sm font-medium hover:text-primary">
            Map
          </Link>
          <Link to="/shelters" className="text-sm font-medium hover:text-primary">
            Shelters
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:text-primary">
            Shop
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 px-0"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium hover:text-primary">
                Profile
              </Link>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-sm font-medium hover:text-primary"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-medium hover:text-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}