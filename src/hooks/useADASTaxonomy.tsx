import { useQuery } from '@tanstack/react-query'
import * as XLSX from 'xlsx'

interface TaxonomyRow {
  [key: string]: string
}

interface TaxonomyData {
  columns: string[]
  rows: TaxonomyRow[]
}

const fetchADASTaxonomy = async (): Promise<TaxonomyData> => {
  const response = await fetch('/data/adas_taxonomy.xlsx')
  const arrayBuffer = await response.arrayBuffer()
  
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  
  // Convert to JSON array
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
  
  if (jsonData.length === 0) return { columns: [], rows: [] }
  
  // First row contains column headers - ensure we get ALL columns
  const columns = jsonData[0]
    .map(col => String(col || '').trim())
    .filter(col => col !== '') // Remove empty column headers
  
  console.log('ADAS Taxonomy columns:', columns)
  
  // Remaining rows contain data
  const rows = jsonData.slice(1).map((row, rowIndex) => {
    const rowObj: TaxonomyRow = {}
    // Ensure we process ALL columns for each row
    columns.forEach((col, index) => {
      const cellValue = row[index]
      rowObj[col] = cellValue !== undefined && cellValue !== null ? String(cellValue).trim() : ''
    })
    return rowObj
  }).filter(row => {
    // Filter out completely empty rows
    return Object.values(row).some(val => val !== '')
  })
  
  console.log('ADAS Taxonomy rows sample:', rows.slice(0, 2))
  
  return { columns, rows }
}

export const useADASTaxonomy = () => {
  return useQuery({
    queryKey: ['adas-taxonomy'],
    queryFn: fetchADASTaxonomy,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
