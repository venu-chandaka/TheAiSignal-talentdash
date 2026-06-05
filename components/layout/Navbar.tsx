import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-coral font-bold text-xl tracking-tight">Talent</span>
            <span className="text-deep-text font-bold text-xl tracking-tight">Dash</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/salaries" className="text-body-text hover:text-deep-text text-sm font-medium transition-colors">
              Salaries
            </Link>
            <Link href="/compare" className="text-body-text hover:text-deep-text text-sm font-medium transition-colors">
              Compare
            </Link>
            <Link
              href="/api/ingest-salary"
              className="bg-coral text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#e54e53] transition-colors"
            >
              Submit Salary
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}