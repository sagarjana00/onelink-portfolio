import { Link } from 'react-router-dom';

function Header() {
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          OneLink
        </Link>

        <nav className="flex items-center gap-8">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="hover:text-gray-300 transition">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;