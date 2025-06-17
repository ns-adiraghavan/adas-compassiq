
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

export function DataTable() {
  const { data: waypointData, isLoading } = useWaypointData()

  const tableData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    console.log('Processing table data...')
    
    const allRows = []
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.slice(0, 10).forEach((row: any) => { // Show first 10 rows
          allRows.push({
            feature: row.Feature || row.feature || 'Unknown Feature',
            oem: row.OEM || row.oem || 'Unknown OEM',
            country: row.Country || row.country || 'Unknown Country',
            availability: row.Availability || row.availability || row.Status || 'Unknown'
          })
        })
      }
    })

    return allRows.slice(0, 5) // Show top 5 for the dashboard
  }, [waypointData])

  if (isLoading) {
    return (
      <Card className="hover-lift animate-slide-in-right bg-gradient-to-br from-card/50 to-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Feature Availability Overview</CardTitle>
          <CardDescription className="text-muted-foreground">Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift animate-slide-in-right bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground">Feature Availability Overview</CardTitle>
        <CardDescription className="text-muted-foreground">
          {tableData.length > 0 ? 'Recent data from WayPoint database' : 'No data available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tableData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50 transition-colors duration-200">
                <TableHead className="text-muted-foreground font-semibold">Feature</TableHead>
                <TableHead className="text-muted-foreground font-semibold">OEM</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Country</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="border-border hover:bg-muted/30 transition-all duration-200 hover:translate-x-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
                  <TableCell className="text-muted-foreground">{row.oem}</TableCell>
                  <TableCell className="text-muted-foreground">{row.country}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      row.availability.toLowerCase().includes('available') || row.availability.toLowerCase().includes('yes') 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      row.availability.toLowerCase().includes('limited') || row.availability.toLowerCase().includes('partial')
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {row.availability}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>No data available. Upload CSV files to see feature data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
