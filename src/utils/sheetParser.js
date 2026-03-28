const parseCsvLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

const normalizeHeader = (header) => header.toLowerCase().trim().replace(/\s+/g, '_')

const headerAliases = {
  name: ['name', 'restaurant', 'restaurant_name'],
  address: ['address', 'street', 'location'],
  city: ['city', 'town', 'municipality'],
  latitude: ['latitude', 'lat'],
  longitude: ['longitude', 'lng', 'lon'],
  cuisine: ['cuisine', 'category', 'type'],
  halal_status: ['halal_status', 'halal', 'status'],
  phone: ['phone', 'tel', 'mobile'],
  website: ['website', 'url', 'link'],
  hours: ['hours', 'opening_hours', 'opening'],
}

const resolveHeaderIndex = (headers, aliases) => {
  for (const alias of aliases) {
    const index = headers.findIndex((header) => header === alias)
    if (index >= 0) {
      return index
    }
  }
  return -1
}

/**
 * Parse a CSV string from Google Sheets into keyed row objects.
 * @param {string} csvText
 * @returns {Array<Record<string, string>>}
 */
export const sheetParser = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    return []
  }

  const normalizedText = csvText.replace(/^\uFEFF/, '')

  const lines = normalizedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return []
  }

  const headers = parseCsvLine(lines[0]).map((header) => normalizeHeader(header.replace(/^"|"$/g, '').trim()))

  const keyIndex = Object.entries(headerAliases).reduce((accumulator, [key, aliases]) => {
    accumulator[key] = resolveHeaderIndex(headers, aliases)
    return accumulator
  }, {})

  return lines
    .slice(1)
    .map((line) => {
      const cells = parseCsvLine(line)
      return {
        name: (cells[keyIndex.name] ?? '').replace(/^"|"$/g, '').trim(),
        address: (cells[keyIndex.address] ?? '').replace(/^"|"$/g, '').trim(),
        city: (cells[keyIndex.city] ?? '').replace(/^"|"$/g, '').trim(),
        latitude: (cells[keyIndex.latitude] ?? '').replace(/^"|"$/g, '').trim(),
        longitude: (cells[keyIndex.longitude] ?? '').replace(/^"|"$/g, '').trim(),
        cuisine: (cells[keyIndex.cuisine] ?? '').replace(/^"|"$/g, '').trim(),
        halal_status: (cells[keyIndex.halal_status] ?? '').replace(/^"|"$/g, '').trim(),
        phone: (cells[keyIndex.phone] ?? '').replace(/^"|"$/g, '').trim(),
        website: (cells[keyIndex.website] ?? '').replace(/^"|"$/g, '').trim(),
        hours: (cells[keyIndex.hours] ?? '').replace(/^"|"$/g, '').trim(),
      }
    })
    .filter((row) => Object.values(row).some((value) => value !== ''))
}

export default sheetParser
