import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useADASTaxonomy } from "@/hooks/useADASTaxonomy"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ADASTaxonomyButton = () => {
  const { data, isLoading, error } = useADASTaxonomy()

  // Get columns and rows from data
  const columns = data?.columns || []
  const rows = data?.rows || []

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Taxonomy
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-[1000px] max-w-[95vw] p-0 bg-background/98 backdrop-blur-sm border shadow-2xl z-50"
        side="bottom"
        align="start"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">AD/ADAS Taxonomy</h3>
          
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading taxonomy...
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-destructive">
              Failed to load taxonomy data
            </div>
          )}
          
          {rows.length > 0 && (
            <ScrollArea className="h-[600px] w-full rounded-md border">
              <div className="min-w-max">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                    <TableRow>
                      {columns.map((col, idx) => (
                        <TableHead 
                          key={idx} 
                          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap ${
                            idx === 0 ? 'w-[180px]' : 
                            idx === columns.length - 1 ? 'min-w-[300px]' : 'min-w-[150px]'
                          }`}
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        {columns.map((col, colIdx) => (
                          <TableCell 
                            key={colIdx} 
                            className={`px-3 py-2 align-top text-xs ${
                              colIdx === 0 ? 'font-medium' : ''
                            } ${colIdx === columns.length - 1 ? 'whitespace-normal' : 'whitespace-pre-wrap'}`}
                          >
                            {row[col] || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ADASTaxonomyButton
