
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import * as XLSX from 'xlsx'

interface TaxonomyRow {
  [key: string]: string
}

interface TaxonomyData {
  columns: string[]
  rows: TaxonomyRow[]
}

const parseXLSX = (buffer: ArrayBuffer): TaxonomyData => {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    
    // Convert to JSON array
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
    
    if (jsonData.length === 0) return { columns: [], rows: [] }
    
    // First row contains column headers
    const columns = jsonData[0].map(col => String(col || '').trim())
    
    // Remaining rows contain data
    const rows = jsonData.slice(1).map(row => {
      const rowObj: TaxonomyRow = {}
      columns.forEach((col, index) => {
        rowObj[col] = String(row[index] || '').trim()
      })
      return rowObj
    })
    
    return { columns, rows }
  } catch (error) {
    console.error('Error parsing XLSX file:', error)
    throw new Error('Failed to parse XLSX file')
  }
}

const fetchTaxonomyFile = async (fileName: string): Promise<TaxonomyData> => {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(`uploads/${fileName}`)
  
  if (error) {
    throw new Error(`Failed to fetch ${fileName}: ${error.message}`)
  }
  
  const buffer = await data.arrayBuffer()
  return parseXLSX(buffer)
}

export const useFeaturesTaganomy = () => {
  return useQuery({
    queryKey: ['taxonomy', 'features-xlsx'],
    queryFn: () => fetchTaxonomyFile('Features_Taxanomy.xlsx'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBusinessModelTaxonomy = () => {
  return useQuery({
    queryKey: ['taxonomy', 'business-model-xlsx'],
    queryFn: () => fetchTaxonomyFile('Business_model_Taxanomy.xlsx'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
