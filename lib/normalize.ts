const STRIP_WORDS = [
  'pvt ltd', 'pvt. ltd', 'private limited', 'ltd', 'llc',
  'inc', 'incorporated', 'technologies', 'technology', 'tech',
  'solutions', 'services', 'software', 'systems', 'consulting',
  'bpo', 'india', '.com', 'group', 'global', 'international',
]

const ALIASES: Record<string, string> = {
  'tata consultancy': 'tcs',
  'tata consultancy services': 'tcs',
  'meta platforms': 'meta',
  'facebook': 'meta',
  'alphabet': 'google',
  'google india': 'google',
  'amazon india': 'amazon',
  'amazon web services': 'aws',
  'microsoft india': 'microsoft',
  'flipkart internet': 'flipkart',
  'walmart labs': 'walmart',
  'phonepe': 'phonepe',
  'phone pe': 'phonepe',
  'hcl technologies': 'hcl',
  'hcltech': 'hcl',
  'infosys bpo': 'infosys',
  'wipro technologies': 'wipro',
}

export function normalizeCompanyName(raw: string): string {
  let name = raw.toLowerCase().trim()

  // Check alias map first
  if (ALIASES[name]) return ALIASES[name]

  // Strip common suffixes
  for (const word of STRIP_WORDS) {
    name = name.replace(new RegExp(`\\b${word}\\b`, 'gi'), '')
  }

  // Remove special characters, collapse spaces
  name = name.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()

  // Check alias again after stripping
  if (ALIASES[name]) return ALIASES[name]

  return name
}

export function slugify(name: string): string {
  return normalizeCompanyName(name)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
