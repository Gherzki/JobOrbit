import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react/jsx-runtime'

const countries = [
  { url_add: 'api/jobs/', label: 'United States of America' },
  { url_add: 'api/jobs/', label: 'Canada' },
  { url_add: 'api/jobs/', label: 'France' },
  { url_add: 'api/jobs/', label: 'Germany' },
  { url_add: 'api/jobs/', label: 'United Kingdom of Great Britain and Northern Ireland' },
]

function CountryDropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">

      <MenuButton className="
        inline-flex items-center gap-2
        px-4 py-2
        rounded-xl
        bg-slate-800/60 hover:bg-slate-800
        border border-slate-700 hover:border-slate-500
        text-sm font-medium text-slate-300 hover:text-slate-100
        shadow-sm
        transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        data-[active]:bg-slate-700
      ">
        {/* Globe icon */}
        <svg
          className="w-4 h-4 text-amber-400"
          fill="none" viewBox="0 0 24 24"
          strokeWidth={1.8} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>

        All Countries

        {/* Chevron */}
        <svg
          className="w-3 h-3 text-slate-500 ml-0.5 transition-transform duration-200 ui-open:rotate-180"
          fill="none" viewBox="0 0 24 24"
          strokeWidth={2.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </MenuButton>

      {/* Dropdown panel */}
      <MenuItems
        anchor="bottom start"
        as="section"
        className="
          z-50 mt-2 w-72
          rounded-2xl
          bg-slate-900
          border border-slate-700/80
          shadow-2xl shadow-black/40
          ring-1 ring-black/20
          p-1.5
          focus:outline-none
          origin-top-left
          transition
          data-[closed]:scale-95 data-[closed]:opacity-0
          data-[enter]:duration-100 data-[leave]:duration-75
        "
      >
        {/* Header */}
        <div className="px-3 py-2 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Filter by Country
          </p>
        </div>
        <div className="h-px bg-slate-700/60 mx-1 mb-1" />

        {countries.map((country) => (
          <MenuItem key={country.label} as={Fragment}>
            {({ focus, active }) => (
              <a
                href={country.url_add}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-sm font-medium truncate',
                  'transition-colors duration-100 cursor-pointer',
                  (focus || active)
                    ? 'bg-amber-400/10 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                )}
              >
                <span className={clsx(
                  'flex-shrink-0 w-1.5 h-1.5 rounded-full transition-colors',
                  (focus || active) ? 'bg-amber-400' : 'bg-slate-600'
                )} />

                <span className="truncate">{country.label}</span>

                {(focus || active) && (
                  <svg
                    className="ml-auto flex-shrink-0 w-3.5 h-3.5 text-amber-400"
                    fill="none" viewBox="0 0 24 24"
                    strokeWidth={2.5} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </a>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default CountryDropdown