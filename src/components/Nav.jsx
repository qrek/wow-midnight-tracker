'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  {
    href: '/',
    label: 'Roster',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/compare',
    label: 'Comparer',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/analysis',
    label: 'Analyser',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: '/strategies',
    label: 'Mythique+',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: '/raids',
    label: 'Raids',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

function NavLinks({ pathname, onClick }) {
  const guildName = process.env.NEXT_PUBLIC_GUILD_DISPLAY_NAME || 'Midnight Tracker'
  return (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-void-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl
                          bg-gradient-to-br from-arcane-600/60 to-void-800 border border-arcane-600/30">
            🌙
          </div>
          <div>
            <div className="font-bold text-gold-500 text-sm tracking-widest leading-tight">MIDNIGHT</div>
            <div className="text-void-400 text-xs tracking-wider">TRACKER</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-xs text-void-400 truncate">{guildName}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_LINKS.map(link => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                          transition-all duration-200 group
                          ${isActive
                            ? 'bg-arcane-600/20 text-arcane-300 border border-arcane-600/30'
                            : 'text-void-300 hover:text-void-100 hover:bg-void-800 border border-transparent'
                          }`}
            >
              <span className={`transition-colors ${isActive ? 'text-arcane-400' : 'text-void-500 group-hover:text-void-300'}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-arcane-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-void-700">
        <div className="text-xs text-void-500 text-center space-y-1">
          <div className="text-void-400 font-medium">WoW Midnight · S1</div>
          <div className="flex items-center justify-center gap-3 text-void-600">
            <span>WCL API</span><span>·</span><span>Blizzard API</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-void-900 border-r border-void-700 flex-col z-50">
        <NavLinks pathname={pathname} />
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-void-900 border-b border-void-700 z-50 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-void-400 hover:text-void-100 hover:bg-void-800 transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌙</span>
          <span className="font-bold text-gold-500 text-sm tracking-widest">MIDNIGHT</span>
          <span className="text-void-500 text-xs tracking-wider">TRACKER</span>
        </div>
        {/* Current page indicator */}
        <div className="ml-auto">
          {NAV_LINKS.find(l => l.href === pathname || (l.href !== '/' && pathname.startsWith(l.href))) && (
            <span className="text-xs text-arcane-400 font-medium">
              {NAV_LINKS.find(l => l.href === pathname || (l.href !== '/' && pathname.startsWith(l.href)))?.label}
            </span>
          )}
        </div>
      </header>

      {/* ── Mobile drawer overlay ─────────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer */}
          <aside
            className="relative w-72 max-w-[85vw] h-full bg-void-900 border-r border-void-700 flex flex-col z-10"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-void-400 hover:text-void-100 hover:bg-void-800 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <NavLinks pathname={pathname} onClick={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
