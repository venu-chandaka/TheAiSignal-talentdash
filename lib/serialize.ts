export function serializeRecord<T>(record: T): T {
  return JSON.parse(
    JSON.stringify(record, (_, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  )
}

export function serializeRecords<T>(records: T[]): T[] {
  return records.map(serializeRecord)
}