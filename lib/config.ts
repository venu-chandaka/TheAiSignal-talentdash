export const CURRENCY_RATES: Record<string, number> = {
  INR_TO_USD: 0.012,
  INR_TO_GBP: 0.0095,
  INR_TO_EUR: 0.011,
}

export const PAGINATION_LIMIT = 25
export const MAX_PAGINATION_LIMIT = 100

export const LEVEL_LABELS: Record<string, string> = {
  L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6',
  SDE_I: 'SDE-I', SDE_II: 'SDE-II', SDE_III: 'SDE-III',
  STAFF: 'Staff', PRINCIPAL: 'Principal', IC4: 'IC4', IC5: 'IC5',
}

export const LEVEL_COLORS: Record<string, string> = {
  L3: 'bg-slate-100 text-slate-700',
  SDE_I: 'bg-slate-100 text-slate-700',
  L4: 'bg-blue-100 text-blue-700',
  SDE_II: 'bg-blue-100 text-blue-700',
  L5: 'bg-indigo-100 text-indigo-700',
  SDE_III: 'bg-indigo-100 text-indigo-700',
  L6: 'bg-purple-100 text-purple-700',
  STAFF: 'bg-purple-100 text-purple-700',
  PRINCIPAL: 'bg-[#1e3a5f] text-white',
  IC4: 'bg-orange-100 text-orange-700',
  IC5: 'bg-rose-100 text-rose-700',
}

export const ALL_LEVELS = [
  'L3','L4','L5','L6',
  'SDE_I','SDE_II','SDE_III',
  'STAFF','PRINCIPAL','IC4','IC5',
] as const