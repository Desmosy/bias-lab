import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isArticlePage = location.pathname.startsWith('/articles/')

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/20 bg-black/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-6">
        <div className="flex items-center space-x-8">
          <Link to="/" className="openai-heading text-xl text-white">
            The Bias Lab
          </Link>
          {isArticlePage && (
            <Link
              to="/"
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← All Narratives
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
            Docs
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
            API reference
          </Link>
        </div>
      </div>
    </header>
  )
}