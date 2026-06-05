'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_LEVELS, LEVEL_LABELS } from '@/lib/config'

const CURRENCIES = ['INR', 'USD', 'GBP', 'EUR']
const SOURCES = ['CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED']
const LOCATIONS = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'Remote', 'Other']

export default function SubmitSalaryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState({
    companyName: '',
    role: '',
    level: '',
    location: '',
    currency: 'INR',
    experienceYears: '',
    baseSalary: '',
    bonus: '',
    stock: '',
    source: 'CONTRIBUTOR',
    confidenceScore: '0.9',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  async function handleSubmit() {
    setLoading(true)
    setServerError('')
    setErrors({})

    try {
      const res = await fetch('/api/ingest-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          experienceYears: Number(form.experienceYears),
          baseSalary: Number(form.baseSalary),
          bonus: Number(form.bonus || 0),
          stock: Number(form.stock || 0),
          confidenceScore: Number(form.confidenceScore),
        }),
      })

      const data = await res.json()

      if (res.status === 201) {
        setSuccess(true)
      } else if (res.status === 400) {
        setErrors(data.errors ?? {})
      } else if (res.status === 409) {
        setServerError(data.error)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-border p-10 shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-deep-text mb-2">Salary Submitted!</h1>
          <p className="text-body-text mb-6">
            Thank you for contributing. Your record has been saved and will appear in the table shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setForm({ companyName:'',role:'',level:'',location:'',currency:'INR',experienceYears:'',baseSalary:'',bonus:'',stock:'',source:'CONTRIBUTOR',confidenceScore:'0.9' }) }}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-body-text hover:bg-hover-surface transition-colors"
            >
              Submit Another
            </button>
            <button
              onClick={() => router.push('/salaries')}
              className="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-[#e54e53] transition-colors"
            >
              View Salaries
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[36px] font-bold text-deep-text">Submit Your Salary</h1>
        <p className="text-body-text mt-2">
          Help the community by sharing your compensation data. All submissions are anonymous.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">

        {/* Company + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name *" error={errors.companyName}>
            <input
              type="text"
              placeholder="e.g. Google, Amazon, Flipkart"
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              className={inputClass(errors.companyName)}
            />
          </Field>
          <Field label="Role / Job Title *" error={errors.role}>
            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className={inputClass(errors.role)}
            />
          </Field>
        </div>

        {/* Level + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Level *" error={errors.level}>
            <select
              value={form.level}
              onChange={(e) => update('level', e.target.value)}
              className={inputClass(errors.level)}
            >
              <option value="">Select level</option>
              {ALL_LEVELS.map((l) => (
                <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
              ))}
            </select>
          </Field>
          <Field label="Location *" error={errors.location}>
            <select
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              className={inputClass(errors.location)}
            >
              <option value="">Select city</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Experience + Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Years of Experience *" error={errors.experienceYears}>
            <input
              type="number"
              placeholder="e.g. 4"
              min={0}
              max={50}
              value={form.experienceYears}
              onChange={(e) => update('experienceYears', e.target.value)}
              className={inputClass(errors.experienceYears)}
            />
          </Field>
          <Field label="Currency *" error={errors.currency}>
            <select
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              className={inputClass(errors.currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Salary fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Base Salary (Annual) *" error={errors.baseSalary}>
            <input
              type="number"
              placeholder="e.g. 3500000"
              value={form.baseSalary}
              onChange={(e) => update('baseSalary', e.target.value)}
              className={inputClass(errors.baseSalary)}
            />
          </Field>
          <Field label="Annual Bonus" error={errors.bonus}>
            <input
              type="number"
              placeholder="e.g. 400000"
              value={form.bonus}
              onChange={(e) => update('bonus', e.target.value)}
              className={inputClass(errors.bonus)}
            />
          </Field>
          <Field label="Annual Stock (RSU)" error={errors.stock}>
            <input
              type="number"
              placeholder="e.g. 800000"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
              className={inputClass(errors.stock)}
            />
          </Field>
        </div>

        {/* Total comp preview */}
        {form.baseSalary && (
          <div className="bg-app-bg rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Total Compensation (computed)
            </p>
            <p className="text-2xl font-bold text-data-blue">
              ₹{(
                (Number(form.baseSalary) || 0) +
                (Number(form.bonus) || 0) +
                (Number(form.stock) || 0)
              ).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted mt-1">Base + Bonus + Stock</p>
          </div>
        )}

        {/* Source */}
        <Field label="Data Source *" error={errors.source}>
          <select
            value={form.source}
            onChange={(e) => update('source', e.target.value)}
            className={inputClass(errors.source)}
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s === 'CONTRIBUTOR' ? 'My own salary (Contributor)'
                  : s === 'SCRAPED' ? 'Scraped from public source'
                  : 'AI Inferred'}
              </option>
            ))}
          </select>
        </Field>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm px-4 py-3 rounded-lg">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-coral text-white py-3 rounded-xl font-semibold text-base hover:bg-[#e54e53] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Salary →'}
        </button>

        <p className="text-xs text-muted text-center">
          Submissions are anonymous. Total compensation is always recomputed server-side.
        </p>
      </div>
    </main>
  )
}

// Helper components
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-deep-text">{label}</label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

function inputClass(error?: string) {
  return `w-full h-10 px-3 text-sm border rounded-lg bg-white text-deep-text placeholder:text-muted focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-danger focus:ring-danger/30'
      : 'border-border focus:ring-coral/30 focus:border-coral'
  }`
}