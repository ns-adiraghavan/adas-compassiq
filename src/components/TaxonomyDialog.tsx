
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useFeaturesTaganomy, useBusinessModelTaxonomy } from '@/hooks/useTaxonomyData'
import { useTheme } from '@/contexts/ThemeContext'

interface TaxonomyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TaxonomyDialog = ({ open, onOpenChange }: TaxonomyDialogProps) => {
  const { theme } = useTheme()
  const featuresQuery = useFeaturesTaganomy()
  const businessModelQuery = useBusinessModelTaxonomy()

  const renderTable = (data: any, isLoading: boolean, error: any, title: string) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className={`text-sm ${theme.textMuted}`}>Loading {title}...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className={`text-sm ${theme.textMuted}`}>Error loading {title}: {error.message}</div>
        </div>
      )
    }

    if (!data || data.rows.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className={`text-sm ${theme.textMuted}`}>No data available for {title}</div>
        </div>
      )
    }

    return (
      <div className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((column: string, index: number) => (
                <TableHead key={index} className={`${theme.textPrimary} font-medium`}>
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {data.columns.map((column: string, colIndex: number) => (
                  <TableCell key={colIndex} className={`${theme.textSecondary} text-sm`}>
                    {row[column] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[80vh] ${theme.cardBackground} ${theme.cardBorder} border`}>
        <DialogHeader>
          <DialogTitle className={`${theme.textPrimary} text-xl font-semibold`}>
            Taxonomy Data
          </DialogTitle>
          <DialogDescription className={theme.textMuted}>
            View Features and Business Model taxonomy information
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="features" className="w-full">
          <TabsList className={`grid w-full grid-cols-2 ${theme.cardBackground}`}>
            <TabsTrigger 
              value="features" 
              className={`${theme.textSecondary} data-[state=active]:${theme.textPrimary}`}
            >
              Features Taxonomy
            </TabsTrigger>
            <TabsTrigger 
              value="business-model"
              className={`${theme.textSecondary} data-[state=active]:${theme.textPrimary}`}
            >
              Business Model Taxonomy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="mt-4">
            {renderTable(
              featuresQuery.data, 
              featuresQuery.isLoading, 
              featuresQuery.error, 
              'Features Taxonomy'
            )}
          </TabsContent>
          
          <TabsContent value="business-model" className="mt-4">
            {renderTable(
              businessModelQuery.data, 
              businessModelQuery.isLoading, 
              businessModelQuery.error, 
              'Business Model Taxonomy'
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default TaxonomyDialog
