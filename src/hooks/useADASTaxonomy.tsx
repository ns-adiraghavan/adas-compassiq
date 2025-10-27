import { useQuery } from '@tanstack/react-query'
import * as XLSX from 'xlsx'

interface TaxonomyRow {
  [key: string]: string
}

const fetchADASTaxonomy = async (): Promise<TaxonomyRow[]> => {
  const response = await fetch('/data/adas_taxonomy.xlsx')
  const arrayBuffer = await response.arrayBuffer()
  
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  
  // Convert to JSON array
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
  
  if (jsonData.length === 0) return []
  
  // First row contains column headers
  const columns = jsonData[0].map(col => String(col || '').trim())
  
  // Remaining rows contain data
  const rows = jsonData.slice(1).map(row => {
    const rowObj: TaxonomyRow = {}
    columns.forEach((col, index) => {
      rowObj[col] = String(row[index] || '').trim()
    })
    return rowObj
  }).filter(row => {
    // Filter out completely empty rows
    return Object.values(row).some(val => val !== '')
  })
  
  return rows
}

export const useADASTaxonomy = () => {
  return useQuery({
    queryKey: ['adas-taxonomy'],
    queryFn: fetchADASTaxonomy,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
