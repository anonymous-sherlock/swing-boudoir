import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Swing Boudoir
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/competitions" className="text-gray-500 hover:text-gray-700">
                Competitions
              </Link>
              <Link to="/winners" className="text-gray-500 hover:text-gray-700">
                Winners
              </Link>
              <Link to="/rules" className="text-gray-500 hover:text-gray-700">
                Rules
              </Link>
              <Link to="/faq" className="text-gray-500 hover:text-gray-700">
                FAQ
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-gray-700">
                Contact
              </Link>
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <Link to="/test" className="text-gray-500 hover:text-gray-700">
                Test
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Link to="/auth/sign-in" className="text-sm text-gray-500 hover:text-gray-700">
                Sign In
              </Link>
              <Link to="/auth/sign-up" className="text-sm text-gray-500 hover:text-gray-700">
                Sign Up
              </Link>
            </div>
            <Link to="/admin" className="text-gray-500 hover:text-gray-700">
              Admin
            </Link>
            <div className="flex space-x-2">
              <Link to="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
                Users
              </Link>
              <Link to="/admin/competitions" className="text-sm text-gray-500 hover:text-gray-700">
                Comp
              </Link>
              <Link to="/admin/settings" className="text-sm text-gray-500 hover:text-gray-700">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
