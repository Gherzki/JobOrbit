'use client';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import backend from "../../utils/Backend.js"
import Job from "../../utils/Job.js"

const COUNTRIES = ['All Countries', 'Philippines', 'United Kingdom', 'Germany', 'France', 'Canada', 'United States']
const SALARY_RANGES = [
  { label: 'Any Salary', min: 0, max: Infinity },
  { label: '₱0 – ₱10,000', min: 0, max: 10000 },
  { label: '₱10,000 – ₱50,000', min: 10000, max: 50000 },
  { label: '₱50,000 – ₱100,000', min: 50000, max: 100000 },
  { label: '₱100,000+', min: 100000, max: Infinity },
]

// ── Small reusable dropdown ──────────────────────────────────────────────────
function Dropdown<T extends string>({
  options,
  value,
  onChange,
  icon,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  icon?: React.ReactNode
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="
        inline-flex items-center gap-2 px-4 py-3
        rounded-xl bg-slate-800/60 hover:bg-slate-800
        border border-slate-700 hover:border-slate-500
        text-sm font-medium text-slate-300 hover:text-slate-100
        transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        whitespace-nowrap
      ">
        {icon}
        <span className="max-w-[140px] truncate">{value}</span>
        <svg className="w-3 h-3 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="
          z-50 mt-2 min-w-[180px]
          rounded-2xl bg-slate-900
          border border-slate-700/80
          shadow-2xl shadow-black/40
          p-1.5 focus:outline-none
          transition data-[closed]:scale-95 data-[closed]:opacity-0
          data-[enter]:duration-100 data-[leave]:duration-75
        "
      >
        <div className="px-3 py-1.5 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select</p>
        </div>
        <div className="h-px bg-slate-700/60 mx-1 mb-1" />
        {options.map((opt) => (
          <MenuItem key={opt} as={Fragment}>
            {({ focus }) => (
              <button
                onClick={() => onChange(opt)}
                className={clsx(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left',
                  'text-sm font-medium transition-colors duration-100',
                  focus ? 'bg-amber-400/10 text-amber-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                  value === opt && 'text-amber-400'
                )}
              >
                {value === opt && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
                {value !== opt && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />
                )}
                <span className="truncate">{opt}</span>
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

// ── Job card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  return (
    <article className="
      group relative
      bg-slate-900/60 hover:bg-slate-900
      border border-slate-800 hover:border-slate-600
      rounded-2xl p-6
      transition-all duration-200
      hover:shadow-xl hover:shadow-black/30
      cursor-pointer
    ">
      {/* Amber left-edge accent on hover */}
      <div className="
        absolute left-0 top-4 bottom-4 w-0.5 rounded-full
        bg-amber-400 opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      " />

      <div className="flex items-start justify-between gap-4">
        {/* Left: title + location */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-150 truncate">
            {job.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="text-xs text-slate-500">{job.city}, {job.country}</span>
          </div>
        </div>

        {/* Right: salary */}
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-semibold text-amber-400">
            ₱{job.salaryMin.toLocaleString()} – ₱{job.salaryMax.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="
              px-2.5 py-1 rounded-lg
              bg-slate-800 border border-slate-700
              text-xs font-medium text-slate-400
            "
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-600 group-hover:text-amber-500 transition-colors flex items-center gap-1">
          View details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </article>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function JobPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [titleQuery, setTitleQuery] = useState(searchParams.get('q') ?? '')
  const [cityQuery, setCityQuery] = useState('')
  const [country, setCountry] = useState('All Countries')
  const [salaryRange, setSalaryRange] = useState(SALARY_RANGES[0].label)

  /**
   * The {@link jobs} variable handles the original list of jobs retrieved from
   * the database, while the {@link filteredJobs} variable just filters the jobs
   * found in the {@link jobs} variable.
   * 
   * You can think about this like caching. The results of the backend API are 
   * cached in the {@link jobs} variable.
   */
  const [jobs, setJobs] = useState([] as Job[])
  const [filteredJobs, setFilteredJobs] = useState([] as Job[])

  const activeSalary = SALARY_RANGES.find((r) => r.label === salaryRange) ?? SALARY_RANGES[0]
  

  /**
   * Determines if the {@link Job} object satisfies the
   * filters set by the user.
   * @param job The {@link Job} object to be checked.
   * @returns The value true if it satisfies the filters;
   *    the value false otherwise.
   */
  const is_relevant_job = (job: Job) => {
    const matchTitle = job.title.toLowerCase().includes(titleQuery.toLowerCase())
    const matchCity = job.city.toLowerCase().includes(cityQuery.toLowerCase())
    const matchCountry = country === 'All Countries' || job.country === country
    const matchSalary = job.salaryMax >= activeSalary.min && job.salaryMin <= activeSalary.max
    return matchTitle && matchCity && matchCountry && matchSalary
  }
  
  /**
   * Updates the list of filtered jobs based on the given filters.
   */
  const updateFilteredJobs = () => {
    const filteredJobs = jobs.filter(is_relevant_job)
    setFilteredJobs(filteredJobs)
  }
  
  /**
   * Updates the search parameters in the link.
   */
  const updateSearchParams = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("q", titleQuery)

    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }

  // Calls the backend and processes the API.
  useEffect(() => {
    const jobsPromise = backend.jobs()
    jobsPromise
      .then(jobs => {
        if (jobs === null)
          throw new Error("Backend API returned null instead of a list of jobs.")
        setJobs(jobs)
        updateFilteredJobs()
      })
      .catch(error => {
        console.log(error)
      })
  }, []);   // Do NOT remove the empty array. This avoids infinite loop (and thus, infinite API calls.)

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden px-6 py-12">

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Explore</p>
            <h1 className="text-3xl font-black tracking-tight text-white [font-family:'Sora',system-ui,sans-serif]">
              Job<span className="text-amber-400">Orbit</span>
              <span className="text-slate-500 font-light"> | Jobs</span>
            </h1>
          </div>
          {/* Result count badge */}
          <span className="
            px-3 py-1.5 rounded-xl
            bg-slate-800 border border-slate-700
            text-xs font-semibold text-slate-400
          ">
            {filteredJobs.length} listing{filteredJobs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

        {/* ── Filter row 1: title + country + find ── */}
        <div className="flex items-stretch gap-3">
          {/* Title search */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              value={titleQuery}
              placeholder="Job position, keyword, company..."
              onChange={(e) => setTitleQuery(e.target.value)}
              className="
                w-full h-full pl-11 pr-4 py-3
                rounded-xl bg-slate-800/60 hover:bg-slate-800
                border border-slate-700 focus:border-amber-400/60
                text-sm text-slate-100 placeholder-slate-500
                focus:outline-none focus:shadow-[0_0_0_2px_rgba(251,191,36,0.2)]
                transition-all duration-150
              "
            />
          </div>

          {/* Country dropdown */}
          <Dropdown
            options={COUNTRIES}
            value={country}
            onChange={setCountry}
            icon={
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            }
          />

          {/* Find button */}
          <button className="
            px-6 py-3 rounded-xl
            bg-amber-400 hover:bg-amber-300
            text-slate-900 font-bold text-sm tracking-wide
            shadow-lg shadow-amber-500/20
            transition-all duration-150 active:scale-95
            flex-shrink-0
          " onClick={() => { updateSearchParams(); updateFilteredJobs() }}>
            Find
          </button>
        </div>

        {/* ── Filter row 2: city + salary ── */}
        <div className="flex items-stretch gap-3">
          {/* City search */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <input
              type="text"
              value={cityQuery}
              placeholder="Search city..."
              onChange={(e) => setCityQuery(e.target.value)}
              className="
                pl-11 pr-4 py-3
                rounded-xl bg-slate-800/60 hover:bg-slate-800
                border border-slate-700 focus:border-amber-400/60
                text-sm text-slate-100 placeholder-slate-500
                focus:outline-none focus:shadow-[0_0_0_2px_rgba(251,191,36,0.2)]
                transition-all duration-150
              "
            />
          </div>

          {/* Salary range dropdown */}
          <Dropdown
            options={SALARY_RANGES.map((r) => r.label)}
            value={salaryRange}
            onChange={setSalaryRange}
            icon={
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" />
              </svg>
            }
          />
        </div>

        {/* ── Job listings ── */}
        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-slate-500 text-sm">No jobs match your filters.</p>
              <button
                onClick={() => { setTitleQuery(''); setCityQuery(''); setCountry('All Countries'); setSalaryRange(SALARY_RANGES[0].label) }}
                className="text-amber-400 text-xs hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

      </div>
    </main>
  )
}